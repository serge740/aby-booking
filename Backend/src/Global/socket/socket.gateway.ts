import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class GlobalSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Store connected sockets
  companySockets = new Map<string, Set<string>>();
  employeeSockets = new Map<string, Set<string>>();

  // ──────────────────────────────────────────────
  // On socket connect
  // ──────────────────────────────────────────────
  handleConnection(socket: Socket) {
    console.log(`🔵 Socket connected: ${socket.id}`);
  }

  // ──────────────────────────────────────────────
  // On socket disconnect
  // ──────────────────────────────────────────────
  handleDisconnect(socket: Socket) {
    console.log(`🔴 Socket disconnected: ${socket.id}`);

    this.removeSocketFromMaps(socket.id);
  }

  private removeSocketFromMaps(socketId: string) {
    this.companySockets.forEach((set, companyId) => {
      if (set.delete(socketId) && set.size === 0) {
        this.companySockets.delete(companyId);
      }
    });

    this.employeeSockets.forEach((set, employeeId) => {
      if (set.delete(socketId) && set.size === 0) {
        this.employeeSockets.delete(employeeId);
      }
    });
  }

  // ──────────────────────────────────────────────
  // CLIENT sends:
  // socket.emit("registerUser", { id, type })
  // type = "COMPANY" | "EMPLOYEE"
  // ──────────────────────────────────────────────
  @SubscribeMessage('registerUser')
  registerUser(
    @MessageBody()
    data: { id: string; type: 'COMPANY' | 'EMPLOYEE' },
    @ConnectedSocket() socket: Socket,
  ) {
    if (!data?.id || !data?.type) return;

    if (data.type === 'COMPANY') {
      if (!this.companySockets.has(data.id)) {
        this.companySockets.set(data.id, new Set());
      }
      this.companySockets.get(data.id)?.add(socket.id);

      console.log(`🏢 COMPANY ${data.id} registered → ${socket.id}`);
    }

    if (data.type === 'EMPLOYEE') {
      if (!this.employeeSockets.has(data.id)) {
        this.employeeSockets.set(data.id, new Set());
      }
      this.employeeSockets.get(data.id)?.add(socket.id);

      console.log(`👤 EMPLOYEE ${data.id} registered → ${socket.id}`);
    }

    return { success: true };
  }

  // ──────────────────────────────────────────────
  // Emit to Employee
  // ──────────────────────────────────────────────
  emitToEmployee(employeeId: string, event: string, data: any) {
    const sockets = this.employeeSockets.get(employeeId);
    if (!sockets) return;

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
  }

  // ──────────────────────────────────────────────
  // Emit to Company
  // ──────────────────────────────────────────────
  emitToCompany(companyId: string, event: string, data: any) {
    const sockets = this.companySockets.get(companyId);
    if (!sockets) return;

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, data);
    });
  }

  // ──────────────────────────────────────────────
  // Emit to many recipients
  // ──────────────────────────────────────────────
  emitToRecipients(
    recipients: { id: string; type: 'COMPANY' | 'EMPLOYEE' }[],
    event: string,
    data: any,
  ) {
    recipients.forEach((r) => {
      if (r.type === 'COMPANY') {
        this.emitToCompany(r.id, event, data);
      } else {
        this.emitToEmployee(r.id, event, data);
      }
    });
  }
}
