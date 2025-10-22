import { Controller, Post, Body, Get, Param, Query, ConflictException } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment-management/payment.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('checkout')
  async checkout(@Body() body: any) {
    // Create order
    const order = await this.orderService.createOrder(body);

    // Create payment and get Flutterwave link
      const paymentLink = await this.paymentService.createPayment(order, 'card,mobilemoneyrwanda,ussd,account,qr');

    return { order, paymentLink };
  }

  @Get(':id')
  async getOrder(@Param('id') orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  @Get()
  async getAllOrders(
    @Query('customerName') customerName?: string,
    @Query('customerEmail') customerEmail?: string,
    @Query('customerPhone') customerPhone?: string,
  ) {
    return this.orderService.getAllOrders({ customerName, customerEmail, customerPhone });
  }

  // ✅ Fetch all orders for a specific user
@Get('user/:userId')
async getOrdersByUser(@Param('userId') userId: string) {
  if (!userId) {
    throw new ConflictException('User ID is required');
  }
  return this.orderService.getOrdersByUserId(userId);
}



}
