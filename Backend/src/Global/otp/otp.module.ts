// src/global/otp/otp.module.ts
import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';

@Module({
  providers: [OTPService],
  exports: [OTPService], // 👈 make it available to other modules
})
export class OtpModule {}
