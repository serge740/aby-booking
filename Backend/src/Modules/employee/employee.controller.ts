import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Experience } from '../../common/interfaces/employee.interface';
import { EmployeeStatus, MaritalStatus } from '../../../generated/prisma';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmployeeFileFields, EmployeeUploadConfig } from 'src/common/Utils/file-upload.util';
import { CompanyAuthGuard } from 'src/Guards/company-auth.guard';
import { RequestWithCompany } from 'src/Guards/company-auth.guard';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(EmployeeFileFields, EmployeeUploadConfig),
  )
  @UseGuards(CompanyAuthGuard)
  async create(
    @UploadedFiles()
    files: {
      profileImg?: Express.Multer.File[];
      cv?: Express.Multer.File[];
      applicationLetter?: Express.Multer.File[];
    },
    @Req() req: RequestWithCompany,
    @Body()
    createEmployeeData: {
      first_name: string;
      last_name: string;
      gender: string;
      date_of_birth: string;
      phone: string;
      email: string;
      address: string;
      national_id: string;
      profile_picture?: string;
      cv?: string;
      application_letter?: string;
      position: string;
      departmentId: string;
      marital_status?: MaritalStatus;
      date_hired: string;
      status?: EmployeeStatus;
      experience?: Experience[];
    },
  ) {
    if (files?.profileImg?.[0]?.filename) {
      createEmployeeData.profile_picture = `/uploads/profile/${files.profileImg[0].filename}`;
    }
    if (files?.cv?.[0]?.filename) {
      createEmployeeData.cv = `/uploads/cv_files/${files.cv[0].filename}`;
    }
    if (files?.applicationLetter?.[0]?.filename) {
      createEmployeeData.application_letter = `/uploads/application_letters/${files.applicationLetter[0].filename}`;
    }

    return this.employeeService.create({
      ...createEmployeeData,
      date_of_birth: new Date(createEmployeeData.date_of_birth),
      date_hired: new Date(createEmployeeData.date_hired),
      companyId: req.company?.id, // ✅ now linked to company
    });
  }

  @Get()
  @UseGuards(CompanyAuthGuard)
  findAll(@Req() req: RequestWithCompany) {
    return this.employeeService.findAll(req.company?.id); // ✅ scoped to company
  }

  @Get(':id')
 
  findOne(@Param('id') id: string, ) {
    return this.employeeService.findOne(id, );
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(EmployeeFileFields, EmployeeUploadConfig),
  )
  @UseGuards(CompanyAuthGuard)
  async update(
    @UploadedFiles()
    files: {
      profileImg?: Express.Multer.File[];
      cv?: Express.Multer.File[];
      applicationLetter?: Express.Multer.File[];
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

    return this.employeeService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(CompanyAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: RequestWithCompany) {
    return this.employeeService.remove(id, req.company?.id);
  }
}
