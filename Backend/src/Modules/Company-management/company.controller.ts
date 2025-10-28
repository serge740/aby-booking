import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyFileFields, CompanyUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // ✅ CREATE COMPANY
  @Post()
 @UseInterceptors(
    FileFieldsInterceptor(CompanyFileFields,CompanyUploadConfig)
  )
  async create(@Body() body: any,@UploadedFiles() files: { companyLogo?: Express.Multer.File[] }) {
    // You can add some light inline validation here too
    if (!body.name) {
      throw new Error('Name is required');
    }
    if (!body.email) {
      throw new Error('Name is required');
    }

     if(files?.companyLogo){
        body.logo = `/uploads/company_logos/${files.companyLogo[0].filename}`;
    }


    return this.companyService.createCompany(body);
  }

  // ✅ GET ALL COMPANIES
  @Get()
  async findAll() {
    return this.companyService.getCompanies();
  }

  // ✅ GET ONE COMPANY
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.companyService.getCompanyById(id);
  }

  // ✅ UPDATE COMPANY
  @Put(':id')
   @UseInterceptors(
    FileFieldsInterceptor(CompanyFileFields,CompanyUploadConfig)
  )
  async update(@Param('id') id: string, @Body() body: any,@UploadedFiles() files: { companyLogo?: Express.Multer.File[] }) {
      if(files?.companyLogo){
        body.logo = `/uploads/company_logos/${files.companyLogo[0].filename}`;
    }

    return this.companyService.updateCompany(id, body);
  }

  // ✅ DELETE COMPANY
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
