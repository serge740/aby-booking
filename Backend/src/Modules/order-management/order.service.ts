import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

 async createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: { productId: string; price: number; quantity: number }[];
    currency: string;
  }) {
    // 1. Validate customer info
    if (!data.customerName || !data.customerEmail || !data.customerPhone) {
      throw new BadRequestException('Customer name, email, and phone are required.');
    }

    // 2. Validate items
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException('At least one item is required in the order.');
    }

    for (const [index, item] of data.items.entries()) {
      if (!item.productId) {
        throw new BadRequestException(`Item at index ${index} is missing productId.`);
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        throw new BadRequestException(`Item at index ${index} has invalid price.`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException(`Item at index ${index} has invalid quantity.`);
      }
    }

    // 3. Validate currency
    const allowedCurrencies = ['RWF', 'USD'];
    if (!allowedCurrencies.includes(data.currency)) {
      throw new BadRequestException(`Currency must be one of: ${allowedCurrencies.join(', ')}`);
    }

    // 4. Calculate total amount
    const totalAmount = data.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0,
    );

    // 5. Create order with nested orderItems
    const order = await this.prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        amount: totalAmount,
        currency: data.currency,
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    return order;
  }

  // Update order status
  async updateStatus(orderId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // Get order by ID
  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
         orderItems: {
        include:{
          product:true,
        },
      }, 
      purchasingUser:true,
      payments: true
     },
    });
  }

  async getAllOrders(query?: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) {
    const where: any = {};

    if (query?.customerName) {
      where.customerName = { contains: query.customerName, mode: 'insensitive' };
    }
    if (query?.customerEmail) {
      where.customerEmail = { contains: query.customerEmail, mode: 'insensitive' };
    }
    if (query?.customerPhone) {
      where.customerPhone = { contains: query.customerPhone, mode: 'insensitive' };
    }

    return this.prisma.order.findMany({
      where,
      include: { orderItems: {
        include:{
          product:true,
        },
      }, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Fetch all orders for a specific user
  async getOrdersByUserId(purchasingUserId: string) {
    return this.prisma.order.findMany({
      where: { purchasingUserId }, // Assuming your Order model has a `userId` field
      include: { orderItems: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

}
