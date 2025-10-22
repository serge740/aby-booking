import { Module } from '@nestjs/common';
import { OtpManagementService } from './otp-management.service';

@Module({
  providers: [OtpManagementService],
  exports: [OtpManagementService],
})
export class OtpManagementModule {}
