import { Module } from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { EmployeeAuthController } from './employee-auth.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/Global/email/email.service';
import { OTPService } from 'src/Global/otp/otp.service';

import { EmployeeService } from '../employee.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.Jwt_SECRET_KEY || 'secretkey', // 👈 Use same secret as Admin
      signOptions: { expiresIn: '7d' }, // JWT lifetime
    }),
  ],
  controllers: [EmployeeAuthController],
  providers: [EmployeeAuthService, EmployeeService, PrismaService, EmailService, OTPService,],
  exports: [EmployeeAuthService],
})
export class EmployeeAuthModule {}
