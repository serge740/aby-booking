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
export class PermissionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Permission Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Permission Client disconnected:', client.id);
  }

  @SubscribeMessage('joinCompanyRoom')
  joinCompanyRoom(
    @MessageBody() data: { companyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `company_${data.companyId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // ──────────────────────────────────────────────
  // EVENTS
  // ──────────────────────────────────────────────

  notifyPermissionCreated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('permissionCreated', data);
  }

  notifyPermissionAssigned(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('permissionAssigned', data);
  }

  notifyPermissionRemoved(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('permissionRemoved', data);
  }
}
