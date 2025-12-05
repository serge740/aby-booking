import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class StockGateway {
  @WebSocketServer()
  server: Server;

  notifyCreated(data: any) {
    this.server.emit('stockCreated', data);
  }

  notifyUpdated(data: any) {
    this.server.emit('stockUpdated', data);
  }

  notifyDeleted(id: string) {
    this.server.emit('stockDeleted', { id });
  }
}
