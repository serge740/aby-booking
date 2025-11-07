import {
  Controller, Post, Get, Put, Delete, Param,
  Body, Req, UseGuards, UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-item.service';
import { CompanyAuthGuard, RequestWithCompany } from 'src/Guards/company-auth.guard';
import { CompanyUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('menu-item')

export class MenuItemController {
  constructor(private readonly service: MenuItemService) {}

  @Post()
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImages', maxCount: 10 }
      ],
      CompanyUploadConfig
    )
  )
  create(
    @Req() req: RequestWithCompany,
    @Body() body: any,
    @UploadedFiles() files: any
  ) {
    if (files?.mainImage)
      body.mainImage = `/uploads/menu/${files.mainImage[0].filename}`;
    if (files?.otherImages)
      body.otherImages = files.otherImages.map((f: any) => `/uploads/menu/${f.filename}`);

    return this.service.create(req.company!.id, body);
  }

  @Get()
   @UseGuards(CompanyAuthGuard)
  findAllAsCompany(@Req() req: RequestWithCompany) {
    return this.service.findAllByCompanyId(req.company!.id);
  }
  @Get('all')
  findAll() {
    return this.service.findAll();
  }
  @Get('company/:id')
  findAllByCompanyId(@Param('id') id:string) {
    console.log(id);
    
    return this.service.findAllByCompanyId(id);
  }
  @Get(':id')

  findOne(@Param('id') id:string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(CompanyAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImages', maxCount: 10 }
      ],
      CompanyUploadConfig
    )
  )
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any
  ) {
    if (files?.mainImage)
      body.mainImage = `/uploads/menu/${files.mainImage[0].filename}`;
    if (files?.otherImages)
      body.otherImages = files.otherImages.map((f: any) => `/uploads/menu/${f.filename}`);

    return this.service.update(req.company!.id, id, body);
  }

  @Delete(':id')
   @UseGuards(CompanyAuthGuard)
  delete(@Req() req: RequestWithCompany, @Param('id') id: string) {
    return this.service.delete(req.company!.id, id);
  }
}
