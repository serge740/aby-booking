import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { PrismaService } from 'src/Prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { CompanyNotificationService } from '../company-notification/company-notification.service';
import { PushNotificationsService } from '../push-notification/push-notification.service';

@Module({

  controllers: [OrderController],
  providers: [OrderService, PrismaService,OrdersGateway,CompanyNotificationService,PushNotificationsService],
  exports: [OrderService], // export if other modules need it
})
export class OrderModule {}
