import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerFileFields, partnerUploadConfig } from 'src/common/Utils/file-upload.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(PartnerFileFields,partnerUploadConfig)
  )
  create(@Body() data: any, @UploadedFiles() files: { logo?: Express.Multer.File[] }) {
    if(files?.logo){
        data.logo = `/uploads/partner-photos/${files.logo[0].filename}`;
    }
    return this.partnerService.create(data);
  }

  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(id);
  }

  @Put(':id')
   @UseInterceptors(
    FileFieldsInterceptor(PartnerFileFields,partnerUploadConfig)
  )
  update(@Param('id') id: string, @Body() data: any,@UploadedFiles() files: { logo?: Express.Multer.File[] }) {
    if(files?.logo){
        data.logo = `/uploads/partner-photos/${files.logo[0].filename}`;
    }
    return this.partnerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(id);
  }
}
