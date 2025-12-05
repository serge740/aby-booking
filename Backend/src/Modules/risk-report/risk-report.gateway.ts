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
export class RiskReportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // 🔥 Client will manually join company room
  @SubscribeMessage('joinCompanyRoom')
  handleJoinCompany(
    @MessageBody() data: { companyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `company_${data.companyId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined ${roomName}`);
  }

  // 🔥 Emit only to company room
  notifyRiskReportCreated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('riskReportCreated', data);
  }

  notifyRiskReportUpdated(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('riskReportUpdated', data);
  }

  notifyRiskReportResolved(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('riskReportResolved', data);
  }

  notifyRiskReportRejected(companyId: string, data: any) {
    this.server.to(`company_${companyId}`).emit('riskReportRejected', data);
  }

  notifyRiskReportDeleted(companyId: string, id: string) {
    this.server.to(`company_${companyId}`).emit('riskReportDeleted', { id });
  }
}
