import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { OtpManagementService } from '../Global/Otp-management/otp-management.service';
import { LoggerService } from './Log/logger.service';

@Global()
@Module({
  providers: [PrismaService, OtpManagementService, LoggerService],
  exports: [PrismaService, OtpManagementService, LoggerService],
})
export class CommonModule {}
