import { Module } from '@nestjs/common';
import { PurchasingUserAuthController } from './purchasing-user-auth.controller';
import { PurchasingUserAuthService } from './purchasing-user-auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PurchasingUserAuthGuard } from 'src/Guards/purchasing-user-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'purchasing-user-secret',
      signOptions: { expiresIn: '7d' }, // token expiry
    }),
  ],
  controllers: [PurchasingUserAuthController],
  providers: [PurchasingUserAuthService, PrismaService, PurchasingUserAuthGuard],
  exports: [PurchasingUserAuthService],
})
export class PurchasingUserAuthModule {}
