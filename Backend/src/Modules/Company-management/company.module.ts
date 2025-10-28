import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { EmailService } from 'src/Global/email/email.service';
import { CompanyAuthModule } from './auth/company-auth.module';

@Module({
  controllers: [CompanyController],
  imports:[CompanyAuthModule],
  providers: [CompanyService, PrismaService, EmailService],
  exports: [CompanyService], // optional (only if you need it in other modules)
})
export class CompanyModule {}
