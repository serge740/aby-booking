import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from './order.service';
import { OrderStatus } from 'generated/prisma';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly orderService: OrderService) {}

  // -------------------------------
  // Join Rooms (company, client)
  // -------------------------------


  @SubscribeMessage('join_client')
  handleJoinClient(
    @MessageBody() data: { clientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`client_${data.clientId}`);
    return { joined: true };
  }

  // -------------------------------
  // Create Order
  // -------------------------------

  @SubscribeMessage('create_order')
  async createOrder(@MessageBody() body: any) {
    const order = await this.orderService.createOrder(body);

    // Notify company
    this.server.to(`company_${order.companyId}`).emit('order_created', order);

    // Notify client (if clientId exists)
    if (order.clientId) {
      this.server.to(`client_${order.clientId}`).emit('order_created', order);
    }

    return order;
  }

  // -------------------------------
  // Update Order Status
  // -------------------------------

  @SubscribeMessage('update_order_status')
  async updateOrderStatus(
    @MessageBody()
    data: { orderId: string; status: OrderStatus },
  ) {
    const updated = await this.orderService.updateStatus(data.orderId, data.status);

    // Notify company
    this.server
      .to(`company_${updated.companyId}`)
      .emit('order_status_updated', updated);

    // Notify client
    if (updated.clientId) {
      this.server
        .to(`client_${updated.clientId}`)
        .emit('order_status_updated', updated);
    }

    return updated;
  }

  // -------------------------------
  // Fetch by ID
  // -------------------------------

  @SubscribeMessage('get_order')
  async getOrder(@MessageBody() data: { id: string }) {
    return this.orderService.getOrder(data.id);
  }

  // -------------------------------
  // Fetch All (filters)
  // -------------------------------

  @SubscribeMessage('get_all_orders')
  async getAllOrders(
    @MessageBody()
    filters: {
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
    },
  ) {
    return this.orderService.getAllOrders(filters);
  }

  // -------------------------------
  // Orders for client
  // -------------------------------

  @SubscribeMessage('get_orders_by_client')
  async getOrdersByClient(
    @MessageBody() data: { clientId: string },
  ) {
    return this.orderService.getOrdersByClientId(data.clientId);
  }

  // -------------------------------
  // Orders by order number
  // -------------------------------

  @SubscribeMessage('get_orders_by_order_number')
  async getOrdersByOrderNumber(
    @MessageBody() data: { orderNumber: string },
  ) {
    return this.orderService.getOrdersByOrderNumber(data.orderNumber);
  }

  // -------------------------------
  // Orders for a company
  // -------------------------------

  @SubscribeMessage('get_orders_by_company')
  async getOrdersByCompany(
    @MessageBody() data: { companyId: string },
  ) {
    return this.orderService.getOrdersByCompanyId(data.companyId);
  }
}
