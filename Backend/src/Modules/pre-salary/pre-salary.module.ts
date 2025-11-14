import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PreSalaryService } from './pre-salary.service';
import { PreSalaryController } from './pre-salary.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PreSalaryController],
    imports:[ JwtModule.register({
          secret: process.env.JWT_SECRET || 'yourSecretKey',
          signOptions: { expiresIn: '1d' },
        }),],
  providers: [PreSalaryService, PrismaService],
})
export class PreSalaryModule {}
