import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { PurchasingUserAuthService } from './purchasing-user-auth.service';
import { Response } from 'express';
import { PurchasingUserAuthGuard } from 'src/Guards/purchasing-user-auth.guard';
import { RequestWithPurchasingUser } from 'src/common/interfaces/request-purchasing-user.interface';

@Controller('purchasing-auth')
export class PurchasingUserAuthController {
  constructor(private readonly authService: PurchasingUserAuthService) {}

  @Post('register')
  async register(
    @Body()
    body: { name: string; email: string; phoneNumber: string; password: string },
  ) {
    return await this.authService.registerUser(
      body.name,
      body.email,
      body.phoneNumber,
      body.password,
    );
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.login(body);

      res.cookie('AccessPurchasingUserToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      return { message: 'Login successful', user };
    } catch (error: any) {
      throw new HttpException(error.message || 'Login failed', error.status || 400);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessPurchasingUserToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(PurchasingUserAuthGuard)
  async profile(@Req() req: RequestWithPurchasingUser) {
    return await this.authService.getProfile(req.user!.id);
  }

  @Put('edit-profile')
  @UseGuards(PurchasingUserAuthGuard)
  async editProfile(
    @Req() req: RequestWithPurchasingUser,
    @Body() body: any,
  ) {
    return await this.authService.editProfile(req.user!.id, body);
  }
}
