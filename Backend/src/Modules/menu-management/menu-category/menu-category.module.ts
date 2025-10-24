import { Module } from '@nestjs/common';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategoryService } from './menu-category.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({})],  
  controllers: [MenuCategoryController,],
  providers: [MenuCategoryService, PrismaService,],
  exports: [MenuCategoryService]
})
export class MenuCategoryModule {}
