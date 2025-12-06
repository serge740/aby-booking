import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/Prisma/prisma.service';

import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';
import { RequisitionGateway } from './requisition.gateway';

import { CompanyAuthGuard } from 'src/Guards/company-auth.guard';
import { PushNotificationsService } from '../push-notification/push-notification.service';
import { CompanyNotificationService } from '../company-notification/company-notification.service';

@Module({
  controllers: [RequisitionController],

  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],

  providers: [
    PrismaService,
    RequisitionService,
    RequisitionGateway,
    CompanyAuthGuard,
    CompanyNotificationService,
    PushNotificationsService,
  ],
})
export class RequisitionModule {}
