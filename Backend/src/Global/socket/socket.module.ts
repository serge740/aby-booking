import { Module, Global } from '@nestjs/common';
import { GlobalSocketGateway } from './socket.gateway';

@Global()
@Module({
  providers: [GlobalSocketGateway],
  exports: [GlobalSocketGateway],
})
export class SocketModule {}
