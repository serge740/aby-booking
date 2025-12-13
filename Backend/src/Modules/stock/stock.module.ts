import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StockGateway } from './stock.gateway';
import { EmployeeService } from '../employee/employee.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [StockController],
  providers: [StockService, PrismaService, StockGateway,EmployeeService],
})
export class StockModule {}
