import {
  Controller, Post, Get, Put, Delete, Param,
  Body, Req, UseGuards, UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-item.service';
import { CompanyAuthGuard, RequestWithCompany } from 'src/Guards/company-auth.guard';
import { CompanyUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('menu-item')
@UseGuards(CompanyAuthGuard)
export class MenuItemController {
  constructor(private readonly service: MenuItemService) {}

  @Post()
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
  findAll(@Req() req: RequestWithCompany) {
    return this.service.findAll(req.company!.id);
  }

  @Put(':id')
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
  delete(@Req() req: RequestWithCompany, @Param('id') id: string) {
    return this.service.delete(req.company!.id, id);
  }
}
