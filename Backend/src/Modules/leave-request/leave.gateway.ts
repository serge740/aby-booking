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
export class LeaveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  // 🔥 Emit new leave creation
  notifyLeaveCreated(data: any) {
    this.server.emit('leaveCreated', data);
  }

  // 🔥 Emit leave update
  notifyLeaveUpdated(data: any) {
    this.server.emit('leaveUpdated', data);
  }

  // 🔥 Emit approval
  notifyLeaveApproved(data: any) {
    this.server.emit('leaveApproved', data);
  }

  // 🔥 Emit rejection
  notifyLeaveRejected(data: any) {
    this.server.emit('leaveRejected', data);
  }

  // 🔥 Emit delete
  notifyLeaveDeleted(id: string) {
    this.server.emit('leaveDeleted', { id });
  }
}
