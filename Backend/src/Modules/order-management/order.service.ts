import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus , PaymentStatus, PurposeStatus} from 'generated/prisma'; // optional import if using enums from Prisma
import { EmailService } from 'src/Global/email/email.service';
import { CompanyNotificationService } from '../company-notification/company-notification.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
     private readonly notificationService:  CompanyNotificationService,
  ) { }

  // Create a new order
  async createOrder(data: {
    clientId?: string;
    clientName: string;
    companyId: string;
    clientEmail?: string;
    clientPhone?: string;
    notes?: string;
    employeeId?: string;
    items: { menuItemId: string; unitPrice: number; quantity: number }[];
  }) {
    console.log(data)
    // Validate client info
    const partner = await this.prisma.company.findUnique({ where: { id: data.companyId } })
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

    // Calculate total amount
    const totalAmount = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    // Generate order number
    const orderNumber = uuidv4().slice(0, 8).toUpperCase();

    const orderData: any = {
      orderNumber,
      clientName: data.clientName,
      companyId: data.companyId,
      

      totalAmount,
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
        'Order-Confirmation', // HBS template name
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

  // Update order status



  /** ===============================
   * 🧩 Update Order Status
   * - If COMPLETED, reduce stock of DRINKING menu items
   * - Handles stock unit "pack" using subquantity
   * =============================== */
  async updateStatus(
    orderId: string,
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  ) {
    // 1️⃣ Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: { include: { menuItem: { include: { stock: true } } } },
        client: true,
        company: true,
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
          
          

          const newQuantity =  quantityToRemove - orderItem.quantity;

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

           else{

             
             await this.prisma.stock.update({
               where: { id: stock.id },
               data: { quantity: newQuantity },
              });
            }
            }
      }
    }

    return updatedOrder;
  }


   /** ===============================
   * 🧩 Update Payment Status
   * =============================== */
  async updatePaymentStatus(orderId: string, status: PaymentStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
      include: {
        items: { include: { menuItem: true } },
        client: true,
        company: true,
      },
    });
  }
  // Get order by ID
  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } }, client: true, company: true },
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
      include: { items: { include: { menuItem: true } }, client: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
