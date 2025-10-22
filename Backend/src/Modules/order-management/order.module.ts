import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentModule } from '../payment-management/payment.module';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [PaymentModule], // so we can call PaymentService from OrderService
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService], // export if other modules need it
})
export class OrderModule {}
