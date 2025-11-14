import { Module } from '@nestjs/common';
import { RiskReportService } from './risk-report.service';
import { RiskReportController } from './risk-report.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [RiskReportController],
  providers: [RiskReportService, PrismaService],
  exports: [RiskReportService],
})
export class RiskReportModule {}
