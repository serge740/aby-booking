import { Module } from '@nestjs/common';
import { PurchasingUserController } from './purchasingUser.controller';
import { PurchasingUserService } from './purchasingUser.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserAuthModule } from './auth/purchasing-user-auth.module';

@Module({
  controllers: [PurchasingUserController],
  imports:[PurchasingUserAuthModule],
  providers: [PurchasingUserService, PrismaService,],
  exports: [PurchasingUserService],
})
export class PurchasingUserModule {}
