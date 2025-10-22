import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TestimonialService } from './testmonial.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TestimonialFileFields, testimonialUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor(TestimonialFileFields, testimonialUploadConfig))
  create(@Body() data: any, @UploadedFiles() files?: { profileImage?: Express.Multer.File[] }) {
    if(files?.profileImage){
        data.profileImage = `/uploads/testmonial-photos/${files?.profileImage?.[0].filename}`
    }
    if(data.rate){
      data.rate = Number(data.rate)
    }
    return this.testimonialService.create(data);
  }

  @Get()
  findAll() {
    return this.testimonialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(TestimonialFileFields, testimonialUploadConfig))
  update(@Param('id') id: string, @Body() data: any,  @UploadedFiles() files?: { profileImage?: Express.Multer.File[] }) {
    if(files?.profileImage){
        data.profileImage = `/uploads/testmonial-photos/${files?.profileImage?.[0].filename}`
    }
     if(data.rate){
      data.rate = Number(data.rate)
    }
    return this.testimonialService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
