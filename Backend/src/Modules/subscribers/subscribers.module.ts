import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { PrismaService } from '../../Prisma/prisma.service';  // Adjust path if needed

@Module({
  providers: [SubscribersService, PrismaService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}