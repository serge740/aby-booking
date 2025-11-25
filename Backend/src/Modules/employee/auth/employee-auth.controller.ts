import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Req,
  UseGuards,
  HttpException,
  Patch,
  Query,
  NotFoundException,
  UseInterceptors,
  Put,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { EmployeeAuthService } from './employee-auth.service';
import { Experience, RequestWithEmployee } from 'src/common/interfaces/employee.interface';
import { EmployeeJwtAuthGuard } from 'src/Guards/employeeGuard.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleEmployeeStateGuard } from 'src/Guards/google-employee-state.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmployeeFileFields, EmployeeUploadConfig } from 'src/common/Utils/file-upload.util';
import { EmployeeStatus, MaritalStatus } from 'generated/prisma';


interface OAuthState {
  redirectUri?: string;
  popup?: boolean;
  [key: string]: any;
}


@Controller('employee')
export class EmployeeAuthController {
  constructor(private readonly employeeAuth: EmployeeAuthService) { }

  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const loginResult = await this.employeeAuth.employeeLogin(body);
    
      
      res.cookie('AccessEmployeeToken', loginResult.token, {
  httpOnly: true,
  secure: false, // must be false on localhost
  sameSite: 'lax', // works on localhost
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

      

      return res.status(200).json(loginResult);
    } catch (error: any) {
      throw new HttpException(error.message || 'Login failed', 400);
    }
  }



  @Patch('change-password')
  @UseGuards(EmployeeJwtAuthGuard)
  async changePassword(
    @Req() req: RequestWithEmployee,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.employeeAuth.changePassword(
      req.employee.id,
      body.currentPassword,
      body.newPassword,
    );
  }

 

  @Post('logout')
  @UseGuards(EmployeeJwtAuthGuard)
  logout(@Res() res: Response) {


    res.clearCookie('AccessEmployeeToken', {
      httpOnly: true,
      secure: process.env.ABY_NODE_ENV === 'production',
      sameSite:  process.env.ABY_NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/', // <-- very important
    });
    return res.json({ message: 'Logged out successfully' });
  }

  @Post('lock')
  @UseGuards(EmployeeJwtAuthGuard)
  async lockEmployee(@Req() req: RequestWithEmployee) {
    const employeeId = req.employee?.id as string;
    if (!employeeId) {
      throw new Error('Employee ID not found in request');
    }
    try {
      return await this.employeeAuth.lockEmployee(employeeId);
    } catch (error) {
      console.log('Error locking employee', error);
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('unlock')
  @UseGuards(EmployeeJwtAuthGuard)
  async unlockEmployee(
    @Req() req: RequestWithEmployee,
    @Body() body: { password: string },
  ) {
    const employeeId = req.employee?.id as string;
    if (!employeeId) {
      throw new Error('Employee ID not found in request');
    }
    try {
      return await this.employeeAuth.unlockEmployee(employeeId, body);
    } catch (error) {
      console.log('Error unlocking employee', error);
      throw new HttpException(error.message, error.status);
    }
  }

   @Put(':id')
    @UseInterceptors(
      FileFieldsInterceptor(EmployeeFileFields, EmployeeUploadConfig),
    )
    @UseGuards(EmployeeJwtAuthGuard)
    async update(
      @UploadedFiles()
      files: {
        profileImg?: Express.Multer.File[];
        cv?: Express.Multer.File[];
        applicationLetter?: Express.Multer.File[];
        identityCardImage?: Express.Multer.File[];
      },
      @Param('id') id: string,
      @Body()
      updateEmployeeData: {
        first_name?: string;
        last_name?: string;
        gender?: string;
        date_of_birth?: string;
        phone?: string;
        email?: string;
        address?: string;
        national_id?: string;
        profile_picture?: string;
        cv?: string;
        application_letter?: string;
        position?: string;
        departmentId?: string;
        marital_status?: MaritalStatus;
        date_hired?: string;
        status?: EmployeeStatus;
        experience?: Experience[];
      },
    ) {
      const updateData: any = { ...updateEmployeeData };
  
      if (updateEmployeeData?.date_of_birth) {
        updateData.date_of_birth = new Date(updateEmployeeData.date_of_birth);
      }
      if (updateEmployeeData?.date_hired) {
        updateData.date_hired = new Date(updateEmployeeData.date_hired);
      }
  
      if (files?.profileImg?.[0]?.filename) {
        updateData.profile_picture = `/uploads/profile/${files.profileImg[0].filename}`;
      }
      if (files?.cv?.[0]?.filename) {
        updateData.cv = `/uploads/cv_files/${files.cv[0].filename}`;
      }
      if (files?.applicationLetter?.[0]?.filename) {
        updateData.application_letter = `/uploads/application_letters/${files.applicationLetter[0].filename}`;
      }
      if (files?.identityCardImage?.[0]?.filename) {
        updateData.identityCardImage = `/uploads/national_id/${files.identityCardImage[0].filename}`;
      }
  
      return this.employeeAuth.update(id, updateData);
    }

  @Get('profile')
  @UseGuards(EmployeeJwtAuthGuard)
  async getCurrentEmployee(@Req() req: RequestWithEmployee) {
    const employeeId = req.employee?.id;
    if (!employeeId) throw new NotFoundException('Employee ID not found in token');

    const employee = await this.employeeAuth.findOne(employeeId); // fetch from DB
    if (!employee) throw new NotFoundException('Employee not found');

    return employee
  }

}
