import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { CompanyAuthGuard } from 'src/Guards/company-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [LeaveController],
  imports:[ JwtModule.register({
        secret: process.env.JWT_SECRET || 'yourSecretKey',
        signOptions: { expiresIn: '1d' },
      }),],
  providers: [LeaveService, PrismaService,CompanyAuthGuard],
})
export class LeaveModule {}
