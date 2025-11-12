import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { PrismaService } from 'src/Prisma/prisma.service';

@Module({

  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService], // export if other modules need it
})
export class OrderModule {}
