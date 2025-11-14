import { Module } from '@nestjs/common';
import { CompanyNotificationService } from './company-notification.service';
import { CompanyNotificationController } from './company-notification.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { DualAuthGuard } from 'src/Guards/dual-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CompanyNotificationController],
  providers: [CompanyNotificationService, PrismaService, DualAuthGuard],
  exports: [CompanyNotificationService],
})
export class CompanyNotificationModule {}
