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
  cors: {
    origin: '*',
  },
})
export class LeaveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Leave WS Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Leave WS Client disconnected:', client.id);
  }

  // 👉 Client manually joins a company room after login
  @SubscribeMessage('joinCompanyRoom')
  handleJoinCompanyRoom(
    @MessageBody() data: { companyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `company_${data.companyId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // -----------------------------------
  //    EMIT ONLY TO THE COMPANY ROOM
  // -----------------------------------

  notifyLeaveCreated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('leaveCreated', data);
  }

  notifyLeaveUpdated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('leaveUpdated', data);
  }

  notifyLeaveApproved(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('leaveApproved', data);
  }

  notifyLeaveRejected(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('leaveRejected', data);
  }

  notifyLeaveDeleted(companyId: string, id: string) {
    this.server.to(`company_${companyId}`).emit('leaveDeleted', { id });
  }
}
