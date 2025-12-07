import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus, PaymentStatus, PurposeStatus } from 'generated/prisma'; // optional import if using enums from Prisma
import { EmailService } from 'src/Global/email/email.service';
import { CompanyNotificationService } from '../company-notification/company-notification.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private readonly notificationService: CompanyNotificationService,
  ) { }

  async createOrder(data: {
    clientId?: string;
    clientName: string;
    companyId: string;
    clientEmail?: string;
    clientPhone?: string;
    notes?: string;
    employeeId?: string;

    items: { menuItemId: string; unitPrice: number; quantity: number, typeShots?: string, typeDrink?: string }[];
  }) {
    console.log(data);

    // Validate client info
    const partner = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!data.clientName) {
      throw new BadRequestException('Client name is required.');
    }
    if (!partner) {
      throw new BadRequestException('Partner is required.');
    }

    // Validate items
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException('At least one order item is required.');
    }

    data.items.forEach((item, idx) => {
      if (!item.menuItemId) throw new BadRequestException(`Item at index ${idx} is missing menuItemId.`);
      if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0)
        throw new BadRequestException(`Item at index ${idx} has invalid unitPrice.`);
      if (!Number.isInteger(item.quantity) || item.quantity <= 0)
        throw new BadRequestException(`Item at index ${idx} has invalid quantity.`);
    });

    // Calculate total amount for new items
    const newItemsTotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    // 🔹 Check if order with same phone number exists today with PENDING or PROCESSING status
    let existingOrder = null as any;
    if (data.clientPhone) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      existingOrder = await this.prisma.order.findFirst({
        where: {
          clientPhone: data.clientPhone,
          companyId: data.companyId,
          status: {
            in: ['PENDING', 'PROCESSING'],
          },
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          items: { include: { menuItem: true } },
          client: true,
          company: true
        },
      });
    }

    // 🔹 If existing order found, add items to it
    if (existingOrder) {
      // Add new items to existing order
      const createdItems = await this.prisma.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: existingOrder.id,
          menuItemId: item.menuItemId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.unitPrice * item.quantity,
        })),
      });

      // Update total amount
      const updatedOrder = await this.prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          totalAmount: existingOrder.totalAmount + newItemsTotal,
          // Optionally update notes if new ones are provided
          ...(data.notes && { notes: data.notes }),
        },
        include: {
          items: { include: { menuItem: true } },
          client: true,
          company: true
        },
      });

      // Send notification about order update
      await this.notificationService.createNotification({
        title: `Order updated`,
        message: `Order ${updatedOrder.orderNumber} has been updated with new items by ${data.clientName}.`,
        recipients: [{ id: data.companyId, type: 'COMPANY', read: false }],
        senderId: data.companyId,
        senderType: 'COMPANY',
        link: `/company/dashboard/orders/${updatedOrder.id}`
      });

      return updatedOrder;
    }

    // 🔹 If no existing order, create new one (original logic)
    const orderNumber = uuidv4().slice(0, 8).toUpperCase();

    const orderData: any = {
      orderNumber,
      clientName: data.clientName,
      companyId: data.companyId,
      totalAmount: newItemsTotal,
    };

    // Only add optional fields if they exist
    if (data.clientId) orderData.clientId = data.clientId;
    if (data.clientEmail) orderData.clientEmail = data.clientEmail;
    if (data.clientPhone) orderData.clientPhone = data.clientPhone;
    if (data.notes) orderData.notes = data.notes;
    if (data.employeeId) orderData.employeeId = data.employeeId;

    // Nested items
    orderData.items = {
      create: data.items.map((item) => ({
        menuItemId: item.menuItemId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        typeDrink: item.typeDrink,
        typeShots: item.typeShots
      })),
    };

    const order = await this.prisma.order.create({
      data: orderData,
      include: { items: { include: { menuItem: true } }, client: true, company: true },
    });

    await this.notificationService.createNotification({
      title: `New order created`,
      message: `New order ${order.orderNumber} has been created by ${data.clientName}.`,
      recipients: [{ id: data.companyId, type: 'COMPANY', read: false }],
      senderId: data.companyId,
      senderType: 'COMPANY',
      link: `/company/dashboard/orders/${order.id}`
    });

    // Email part here
    if (order?.clientEmail) {
      await this.email.sendEmail(
        order?.clientEmail,
        `Your order from ${partner.name} — ABY DASH`,
        'Order-Confirmation',
        {
          clientName: order.clientName,
          company_name: 'ABY DASH',
          partner_name: partner.name,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount.toFixed(2),
          orderDate: new Date().toLocaleDateString(),
          notes: order.notes || '',
          orderUrl: `${process.env.FRONTEND_URL}/track-orders?order=${order.orderNumber}`,
          year: new Date().getFullYear(),
        },
      );
    }

    return order;
  }


  async returnOrderItems(
  orderId: string,
  returnedItems: { orderItemId: string; quantity: number }[]
) {
  return await this.prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                stock: true,
              },
            },
          },
        },
        employee: true,
        company: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");

    let updatedTotalAmount = order.totalAmount;

    for (const returned of returnedItems) {
      const item = order.items.find((i) => i.id === returned.orderItemId);
      if (!item) throw new NotFoundException(`Order item not found: ${returned.orderItemId}`);

      if (returned.quantity <= 0)
        throw new BadRequestException("Returned quantity must be greater than 0");

      if (returned.quantity > item.quantity)
        throw new BadRequestException("Returned quantity exceeds purchased quantity");

      const newQuantity = item.quantity - returned.quantity;
      const itemRefundValue = returned.quantity * item.unitPrice;

      updatedTotalAmount -= itemRefundValue;

      // --------- REMOVE OR UPDATE ITEM ----------
      if (newQuantity === 0) {
        await tx.orderItem.delete({ where: { id: item.id } });
      } else {
        await tx.orderItem.update({
          where: { id: item.id },
          data: {
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          },
        });
      }

      // --------- RESTORE STOCK IF DRINKING ----------
      if (item.menuItem.stockId && item.menuItem.purpose === "DRINKING") {
        await tx.stock.update({
          where: { id: item.menuItem.stockId },
          data: {
            quantity: { increment: returned.quantity },
          },
        });
      }
    }

    // --------- UPDATE ORDER TOTAL ----------
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { totalAmount: updatedTotalAmount },
      include: { items: true },
    });

    // ---------------------------------------------------------
    // 🔔 SEND NOTIFICATIONS TO EMPLOYEE + COMPANY
    // ---------------------------------------------------------

    // Employee Notification
    if (order.employeeId) {
      await this.notificationService.createNotification({
        title: "Items Returned",
        message: `Some items from Order #${order.orderNumber} have been returned. Please review the changes.`,
        recipients: [
          { id: order.employeeId, type: "EMPLOYEE", read: false },
        ],
        senderId: order.companyId,
        senderType: "COMPANY",
        link: `/employee/dashboard/orders/${order.id}`,
      });
    }

    // Company Notification (admins)
    await this.notificationService.createNotification({
      title: "Order Items Returned",
      message: `Order #${order.orderNumber} had returned items. Total updated to ${updatedTotalAmount}.`,
      recipients: [
        { id: order.companyId, type: "COMPANY", read: false },
      ],
      senderId: order.employeeId ?? order.companyId,
      senderType: order.employeeId ? "EMPLOYEE" : "COMPANY",
      link: `/company/orders/${order.id}`,
    });


        const newOrder = await tx.order.findUnique({
       where: { id: orderId },
      include: { items: { include: { menuItem: true } }, client: true, company: true },
    });


    return newOrder;
  });
}


  // Update order status



  /** ===============================
   * 🧩 Update Order Status
   * - If COMPLETED, reduce stock of DRINKING menu items
   * - Handles stock unit "pack" using subquantity
   * =============================== */
  async updateStatus(
    orderId: string,
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'READY'
  ) {
    // 1️⃣ Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: { include: { menuItem: { include: { stock: true } } } },
        client: true,
        company: true,
          employee: true,
      },
    });

    // 2️⃣ If COMPLETED, reduce stock for DRINKING menu items
    if (status === 'COMPLETED') {
      for (const orderItem of updatedOrder.items) {
        const menuItem = orderItem.menuItem;
        const stock = menuItem.stock;

        if (menuItem.purpose === PurposeStatus.DRINKING && stock) {
          let quantityToRemove: number;

          if (stock.unit.toLowerCase() === 'pack' && stock.subquantity) {
            // Remove total subquantity for the pack
            quantityToRemove = stock.subquantity;
          } else {
            // Remove quantity based on order item
            quantityToRemove = orderItem.quantity;
          }

          console.log(quantityToRemove);



          const newQuantity = quantityToRemove - orderItem.quantity;

          if (newQuantity < 0) {
            throw new HttpException(
              `Not enough stock for menu item: ${menuItem.name}`,
              400
            );
          }

          if (stock.unit.toLowerCase() === 'pack' && stock.subquantity) {

            await this.prisma.stock.update({
              where: { id: stock.id },
              data: { subquantity: newQuantity },
            });

          }

          else {


            await this.prisma.stock.update({
              where: { id: stock.id },
              data: { quantity: newQuantity },
            });
          }
        }
      }
    }


    else if (status == 'READY') {

      if (updatedOrder.employeeId) {
        await this.notificationService.createNotification({
          title: `Order Ready for Pickup`,
          message: `Your order placed on ${updatedOrder.createdAt.toDateString()} is now ready for pickup. Please proceed to the pickup point.`,
          recipients: [{ id: updatedOrder.employeeId, type: 'EMPLOYEE', read: false }],
          senderId: updatedOrder.companyId,
          senderType: 'COMPANY',
          link: `/employee/dashboard/orders/${updatedOrder.id}`
        });

      }

    }

    return updatedOrder;
  }


  /** ===============================
  * 🧩 Update Payment Status
  * =============================== */
async updatePaymentStatus(orderId: string, status: PaymentStatus, amount: string) {
  // Find order with current debt information
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found");

  let newDebtedAmount: number | null = null;
  let finalPaymentStatus = status;

  if (status === 'DEBTED') {
    const amountPaid = parseFloat(amount);
    
    if (isNaN(amountPaid) || amountPaid <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Check if there's an existing debt
    if (order.debtedAmount && order.debtedAmount > 0) {
      // Existing debt scenario - customer is paying towards debt
      newDebtedAmount = order.debtedAmount - amountPaid;

      if (amountPaid > order.debtedAmount) {
        throw new Error(`Payment amount (${amountPaid}) cannot exceed remaining debt (${order.debtedAmount})`);
      }

      // CRITICAL FIX: If debt is fully paid, mark as SUCCESSFUL
      if (newDebtedAmount <= 0) {
        newDebtedAmount = null;
        finalPaymentStatus = 'SUCCESSFUL';
      }
    } else {
      // New debt scenario - first time marking as debted
      newDebtedAmount = order.totalAmount - amountPaid;

      if (amountPaid >= order.totalAmount) {
        throw new Error("Amount paid exceeds or equals order total. Use 'SUCCESSFUL' status instead.");
      }

      // CRITICAL FIX: If debt is fully paid immediately, mark as SUCCESSFUL
      if (newDebtedAmount <= 0) {
        newDebtedAmount = null;
        finalPaymentStatus = 'SUCCESSFUL';
      }
    }
  } else {
    // For SUCCESSFUL, FAILED, or PENDING - clear debt
    newDebtedAmount = null;
  }

  // Update order with new payment status and debt amount
  return this.prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: finalPaymentStatus,
      debtedAmount: newDebtedAmount,
    },
    include: {
      items: { include: { menuItem: true } },
      client: true,
      company: true,
      employee: true,
    },
  });
}
  // Get order by ID
  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } }, client: true, company: true,employee:true },
    });
  }

  // Get all orders with optional filters
  async getAllOrders(query?: { clientName?: string; clientEmail?: string; clientPhone?: string }) {
    const where: any = {};

    if (query?.clientName) where.clientName = { contains: query.clientName, mode: 'insensitive' };
    if (query?.clientEmail) where.clientEmail = { contains: query.clientEmail, mode: 'insensitive' };
    if (query?.clientPhone) where.clientPhone = { contains: query.clientPhone, mode: 'insensitive' };

    return this.prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: true } }, client: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get orders by clientId
  async getOrdersByClientId(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: { items: { include: { menuItem: true } }, client: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getOrdersByOrderNumber(orderNumber: string) {
    return this.prisma.order.findMany({
      where: { orderNumber },
      include: { items: { include: { menuItem: true } }, client: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getOrdersByCompanyId(companyId: string) {
    return this.prisma.order.findMany({
      where: { companyId },
      include: { items: { include: { menuItem: true } }, client: true, company: true, employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getOrdersByEmployeeId(employeeId: string) {
    return this.prisma.order.findMany({
      where: { employeeId },
      include: { items: { include: { menuItem: true } }, client: true, company: true,employee:true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
