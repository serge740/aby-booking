import { Module } from '@nestjs/common';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { PrismaService } from 'src/Prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';
import { EmployeeService } from 'src/Modules/employee/employee.service';

@Module({
  imports: [     JwtModule.register({
              secret: process.env.JWT_SECRET || 'yourSecretKey',
              signOptions: { expiresIn: '1d' },
          }),],
  controllers: [MenuItemController],
  providers: [MenuItemService, PrismaService,EmployeeService],
  exports: [MenuItemService,]
})
export class MenuItemModule {}
