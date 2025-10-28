import { Module } from '@nestjs/common';
import { CompanyAuthController } from './company-auth.controller';
import { CompanyAuthService } from './company-auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CompanyAuthController],
  providers: [CompanyAuthService, PrismaService],
})
export class CompanyAuthModule {}
