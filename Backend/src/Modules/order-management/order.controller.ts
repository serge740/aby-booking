import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrdersGateway } from './orders.gateway';
import { OrderStatus,PaymentStatus } from 'generated/prisma';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly ordersGateway: OrdersGateway, // 👈 Inject Gateway
  ) {}

  // -------------------------------
  // Create a new order
  // -------------------------------
  @Post()
  async createOrder(
    @Body()
    body: {
      clientId?: string;
      companyId: string;
      clientName: string;
      clientEmail?: string;
      clientPhone?: string;
      employeeId?: string;
      notes?: string;
      items: { menuItemId: string; unitPrice: number; quantity: number }[];
    },
  ) {
    const order = await this.orderService.createOrder(body);

    // 🔥 Emit event to company room
    this.ordersGateway.server
      .to(`company_${order.companyId}`)
      .emit('order_created', order);

    // 🔥 Emit to client room if exists
    if (order.clientId) {
      this.ordersGateway.server
        .to(`client_${order.clientId}`)
        .emit('order_created', order);
    }

    return order;
  }

  // -------------------------------
  // Update order status
  // -------------------------------
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    const updated = await this.orderService.updateStatus(id, status);

    // 🔥 Emit event to company
    this.ordersGateway.server
      .to(`company_${updated.companyId}`)
      .emit('order_status_updated', updated);

    // 🔥 Emit to client if exists
    if (updated.clientId) {
      this.ordersGateway.server
        .to(`client_${updated.clientId}`)
        .emit('order_status_updated', updated);
    }

    return updated;
  }

  
  /** ===============================
   * 🧩 Update Payment Status
   * =============================== */
  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
    @Body('amount') amount:string,
    @Body('method') method: 'MOMO' | "CASH" ,
  ) {
    const updated = await this.orderService.updatePaymentStatus(id, status,amount,method);

    // 🔥 Emit event to company
    this.ordersGateway.server
      .to(`company_${updated.companyId}`)
      .emit('order_payment_status_updated', updated);

    // 🔥 Emit event to client if exists
    if (updated.clientId) {
      this.ordersGateway.server
        .to(`client_${updated.clientId}`)
        .emit('order_payment_status_updated', updated);
    }

    return updated;
  }

  // -------------------------------
// Return order items
// -------------------------------
@Post(':id/return-items')
async returnItems(
  @Param('id') orderId: string,
  @Body()
  body: {
    returnedItems: { orderItemId: string; quantity: number }[];
  },
) {
  const updated = await this.orderService.returnOrderItems(orderId, body.returnedItems);

  // 🔥 Emit to company
  this.ordersGateway.server
    .to(`company_${updated!.companyId}`)
    .emit('order_items_returned', updated);

  // 🔥 Emit to employee who made the order
  if (updated!.employeeId) {
    this.ordersGateway.server
      .to(`employee_${updated!.employeeId}`)
      .emit('order_items_returned', updated);
  }

  // 🔥 Emit to client if exists
  if (updated!.clientId) {
    this.ordersGateway.server
      .to(`client_${updated!.clientId}`)
      .emit('order_items_returned', updated);
  }

  return updated;
}


  // -------------------------------
  // Get order by ID
  // -------------------------------
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  // -------------------------------
  // Get all orders with filters
  // -------------------------------
  @Get()
  async getAllOrders(
    @Query('clientName') clientName?: string,
    @Query('clientEmail') clientEmail?: string,
    @Query('clientPhone') clientPhone?: string,
  ) {
    return this.orderService.getAllOrders({
      clientName,
      clientEmail,
      clientPhone,
    });
  }

  // -------------------------------
  // Get orders by client
  // -------------------------------
  @Get('client/:clientId')
  async getOrdersByClient(@Param('clientId') clientId: string) {
    return this.orderService.getOrdersByClientId(clientId);
  }

  // -------------------------------
  // Get orders by order number
  // -------------------------------
  @Get('order-number/:orderNumber')
  async getOrdersByOrderNumber(
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.orderService.getOrdersByOrderNumber(orderNumber);
  }

  // -------------------------------
  // Get orders by company
  // -------------------------------
  @Get('company/:companyId')
  async getOrdersByCompany(@Param('companyId') companyId: string) {
    return this.orderService.getOrdersByCompanyId(companyId);
  }
  @Get('employee/:employeeId')
  async getOrdersByEmployee(@Param('employeeId') employeeId: string) {
    return this.orderService.getOrdersByEmployeeId(employeeId);
  }
}
