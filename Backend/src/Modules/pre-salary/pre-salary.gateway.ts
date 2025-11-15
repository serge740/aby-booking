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
export class PreSalaryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('PreSalary WS Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('PreSalary WS Client disconnected:', client.id);
  }

  // 🔥 Emit presalary creation
  notifyPreSalaryCreated(data: any) {
    this.server.emit('preSalaryCreated', data);
  }

  // 🔥 Emit presalary update
  notifyPreSalaryUpdated(data: any) {
    this.server.emit('preSalaryUpdated', data);
  }

  // 🔥 Emit approval
  notifyPreSalaryApproved(data: any) {
    this.server.emit('preSalaryApproved', data);
  }

  // 🔥 Emit rejection
  notifyPreSalaryRejected(data: any) {
    this.server.emit('preSalaryRejected', data);
  }

  // 🔥 Emit deletion
  notifyPreSalaryDeleted(id: string) {
    this.server.emit('preSalaryDeleted', { id });
  }
}
