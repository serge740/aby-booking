import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from 'generated/prisma';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order
  @Post()
  async createOrder(
    @Body()
    body: {
      clientId?: string;
      companyId: string;
      clientName: string;
      clientEmail?: string;
      clientPhone?: string;
      items: { menuItemId: string; unitPrice: number; quantity: number }[];
    },
  ) {
    return this.orderService.createOrder(body);
  }

  // Update order status
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.orderService.updateStatus(id, status);
  }

  // Get order by ID
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  // Get all orders with optional filters
  @Get()
  async getAllOrders(
    @Query('clientName') clientName?: string,
    @Query('clientEmail') clientEmail?: string,
    @Query('clientPhone') clientPhone?: string,
  ) {
    return this.orderService.getAllOrders({ clientName, clientEmail, clientPhone });
  }

  // Get all orders for a specific client
  @Get('client/:clientId')
  async getOrdersByClient(@Param('clientId') clientId: string) {
    return this.orderService.getOrdersByClientId(clientId);
  }
}
