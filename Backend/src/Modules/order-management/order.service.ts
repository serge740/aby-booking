import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from 'generated/prisma'; // optional import if using enums from Prisma

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  // Create a new order
  async createOrder(data: {
    clientId?: string;
    clientName: string;
    companyId: string;
    clientEmail?: string;
    clientPhone?: string;
    items: { menuItemId: string; unitPrice: number; quantity: number }[];
  }) {
    console.log(data)
    // Validate client info
    if (!data.clientName) {
      throw new BadRequestException('Client name is required.');
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
      include: { items: true },
    });


    return order;
  }

  // Update order status
  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
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
}
