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
  UseInterceptors,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { CompanyAuthService } from './company-auth.service';
import { CompanyAuthGuard, RequestWithCompany } from '../../../Guards/company-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyFileFields, CompanyUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('company-auth')
export class CompanyAuthController {
  constructor(private readonly authService: CompanyAuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; phone: string; password: string },
  ) {
    return await this.authService.registerCompany(
      body.name,
      body.email,
      body.phone,
      body.password,
    );
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { company, token } = await this.authService.login(body);

      res.cookie('AccessCompanyToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      return { message: 'Login successful', company };
    } catch (error: any) {
      throw new HttpException(error.message || 'Login failed', error.status || 400);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessCompanyToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(CompanyAuthGuard)
  async profile(@Req() req: RequestWithCompany) {
    return await this.authService.getProfile(req.company!.id);
  }

  @Put('edit-profile/:id')
  @UseGuards(CompanyAuthGuard)
    @UseInterceptors(
     FileFieldsInterceptor(CompanyFileFields,CompanyUploadConfig)
   )
   async update(@Param('id') id: string, @Body() body: any,@UploadedFiles() files: { companyLogo?: Express.Multer.File[] }) {
       if(files?.companyLogo){
         body.logo = `/uploads/company_logos/${files.companyLogo[0].filename}`;
     }
     console.log('Updating company profile with data:', body);
     
    
    return await this.authService.editProfile(id, body);
  }
}
