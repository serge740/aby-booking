import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RiskReportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('RiskReport WS Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('RiskReport WS Client disconnected:', client.id);
  }

  // 🔥 Emit creation
  notifyRiskReportCreated(data: any) {
    this.server.emit('riskReportCreated', data);
  }

  // 🔥 Emit update
  notifyRiskReportUpdated(data: any) {
    this.server.emit('riskReportUpdated', data);
  }

  // 🔥 Emit resolve
  notifyRiskReportResolved(data: any) {
    this.server.emit('riskReportResolved', data);
  }

  // 🔥 Emit reject
  notifyRiskReportRejected(data: any) {
    this.server.emit('riskReportRejected', data);
  }

  // 🔥 Emit deletion
  notifyRiskReportDeleted(id: string) {
    this.server.emit('riskReportDeleted', { id });
  }
}
