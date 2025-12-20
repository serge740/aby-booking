import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RequisitionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Requisition WS Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Requisition WS Client disconnected:', client.id);
  }

  @SubscribeMessage('joinCompanyRoom')
  handleJoinCompanyRoom(
    @MessageBody() data: { companyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `company_${data.companyId}`;
    client.join(room);
    console.log(`Client ${client.id} joined ${room}`);
  }

  // EMIT EVENTS
  notifyCreated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('requisitionCreated', data);
  }

  notifyUpdated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('requisitionUpdated', data);
  }

  notifyApproved(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('requisitionApproved', data);
  }

  notifyRejected(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('requisitionRejected', data);
  }

  notifyDeleted(companyId: string, id: string) {
    this.server.to(`company_${companyId}`).emit('requisitionDeleted', { id });
  }
}
