import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthGuard } from '../../Guards/AdminAuth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AdminService, AdminAuthGuard, RolesGuard],
  controllers: [AdminController],
  exports: [AdminService, AdminAuthGuard, JwtModule, RolesGuard],
})
export class AdminModule {}
