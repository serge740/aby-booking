import {
  Controller, Post, Get, Put, Delete, Body,
  Param, UseGuards, Req, HttpException,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { CompanyAuthGuard, RequestWithCompany } from 'src/Guards/company-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly service: MenuCategoryService) {}
  
  @Post()
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'category_image', maxCount: 1 },
        
        ],
        CompanyUploadConfig
      )
    )
  create(@Req() req: RequestWithCompany, @Body() body:any, @UploadedFiles() files: any) {
       if (files?.categoryImg){
         body.image = `/uploads/category-photos/${files.categoryImg[0].filename}`;
        }
    return this.service.create(req.company!.id, body.name,body.image);
  }

  @Get('all')

  findAll() {
    return this.service.findAll();
  }
  @Get()
  @UseGuards(CompanyAuthGuard)
  findAllAsCompany(@Req() req: RequestWithCompany) {
    return this.service.findByCompanyId(req.company!.id);
  }
  @Get('/company/:id')
  
  findAllByCompany(@Param('id') id:string) {
    return this.service.findByCompanyId(id);
  }

  @Put(':id')
  @UseGuards(CompanyAuthGuard)
   @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'category_image', maxCount: 1 },
        
        ],
        CompanyUploadConfig
      )
    )
  update(
    @Req() req: RequestWithCompany,
     @Param('id') id: string, 
     @Body() body: { name: string, image?:string },
     @UploadedFiles() files: any
    ) {
      if (files?.categoryImg){
         body.image = `/uploads/category-photos/${files.categoryImg[0].filename}`;
        }
    if (!body.name) throw new HttpException('Name required', 400);
    return this.service.update(req.company!.id, id, body.name,body?.image);
  }

  @Delete(':id')
  @UseGuards(CompanyAuthGuard)
  delete(@Req() req: RequestWithCompany, @Param('id') id: string) {
    return this.service.delete(req.company!.id, id);
  }
}
