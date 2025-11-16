import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PreSalaryService } from './pre-salary.service';
import { PreSalaryController } from './pre-salary.controller';
import { JwtModule } from '@nestjs/jwt';
import { PreSalaryGateway } from './pre-salary.gateway';
import { CompanyNotificationService } from '../company-notification/company-notification.service';
import { PushNotificationsService } from '../push-notification/push-notification.service';

@Module({
  controllers: [PreSalaryController],
    imports:[ JwtModule.register({
          secret: process.env.JWT_SECRET || 'yourSecretKey',
          signOptions: { expiresIn: '1d' },
        }),],
  providers: [PreSalaryService, PrismaService,PreSalaryGateway,CompanyNotificationService,PushNotificationsService],
})
export class PreSalaryModule {}
