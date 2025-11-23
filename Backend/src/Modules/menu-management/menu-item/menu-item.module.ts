import { Module } from '@nestjs/common';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { PrismaService } from 'src/Prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [MenuItemController],
  providers: [MenuItemService, PrismaService,],
  exports: [MenuItemService]
})
export class MenuItemModule {}
