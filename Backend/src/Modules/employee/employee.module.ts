import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { EmployeeAuthModule } from './auth/employee-auth.module';
import { AdminAuthGuard } from 'src/Guards/AdminAuth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EmployeeController],
  imports: [
    EmployeeAuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [EmployeeService, PrismaService, AdminAuthGuard],
  exports: [EmployeeService],
})
export class EmployeeModule {}
