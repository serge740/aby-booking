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
export class PreSalaryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('PreSalary Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('PreSalary Client disconnected:', client.id);
  }

  // ✅ Client requests joining a company room
  @SubscribeMessage('joinCompanyRoom')
  joinCompanyRoom(
    @MessageBody() data: { companyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `company_${data.companyId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // -----------------------------------
  //   EMIT TO ONE COMPANY ONLY
  // -----------------------------------

  notifyPreSalaryCreated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('preSalaryCreated', data);
  }

  notifyPreSalaryUpdated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('preSalaryUpdated', data);
  }

  notifyPreSalaryApproved(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('preSalaryApproved', data);
  }

  notifyPreSalaryRejected(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('preSalaryRejected', data);
  }

  notifyPreSalaryDeleted(companyId: string, id: string) {
    this.server.to(`company_${companyId}`).emit('preSalaryDeleted', { id });
  }
}
