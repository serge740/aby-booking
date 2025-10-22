import { Body, Controller, Get, Put, Post, Req, Res, UseGuards, HttpException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { AdminAuthGuard } from '../../Guards/AdminAuth.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestWithAdmin } from '../../common/interfaces/request-admin.interface';
import { AdminRole } from 'generated/prisma';

@Controller('auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@Post('register')
async register(@Body() body: { email: string; password: string; names: string; role?: string }) {
  let role: AdminRole = AdminRole.ADMIN; // default role

  if (body.role) {
    // Validate that body.role is a valid enum value
    if (!Object.values(AdminRole).includes(body.role as AdminRole)) {
      throw new BadRequestException('Invalid role');
    }
    role = body.role as AdminRole;
  }

  return await this.adminService.registerAdmin(body.email, body.password, body.names, role);
}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    try {
      const { admin, token } = await this.adminService.adminLogin(body);

      res.cookie('AccessAdminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return { message: 'Login successful', admin };
    } catch (error: any) {
      throw new HttpException(error.message || 'Login failed', error.status || 400);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessAdminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

 @Get('profile')
@UseGuards(AdminAuthGuard)
async profile(@Req() req: RequestWithAdmin) {
  console.log(req.admin?.id);
  
  const profile = await this.adminService.getAdminProfile(req.admin!.id);
  console.log(profile);
  return profile
  
}

@Put('edit-profile')
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
async editProfile(@Req() req: RequestWithAdmin, @Body() body: any) {
  return await this.adminService.editAdminProfile(req.admin!.id, body);
}

}
