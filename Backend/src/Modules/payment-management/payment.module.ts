import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService,PurchasingUserService],
  exports: [PaymentService], // export so OrderModule can use it
})
export class PaymentModule {}
