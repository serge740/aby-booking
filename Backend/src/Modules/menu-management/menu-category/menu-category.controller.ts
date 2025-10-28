import {
  Controller, Post, Get, Put, Delete, Body,
  Param, UseGuards, Req, HttpException
} from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { CompanyAuthGuard, RequestWithCompany } from 'src/Guards/company-auth.guard';

@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly service: MenuCategoryService) {}
  
  @Post()
  
  @UseGuards(CompanyAuthGuard)
  create(@Req() req: RequestWithCompany, @Body() body: { name: string }) {
    return this.service.create(req.company!.id, body.name);
  }

  @Get()
  @UseGuards(CompanyAuthGuard)
  findAll(@Req() req: RequestWithCompany) {
    return this.service.findAll(req.company!.id);
  }

  @Put(':id')
  @UseGuards(CompanyAuthGuard)
  update(@Req() req: RequestWithCompany, @Param('id') id: string, @Body() body: { name: string }) {
    if (!body.name) throw new HttpException('Name required', 400);
    return this.service.update(req.company!.id, id, body.name);
  }

  @Delete(':id')
  @UseGuards(CompanyAuthGuard)
  delete(@Req() req: RequestWithCompany, @Param('id') id: string) {
    return this.service.delete(req.company!.id, id);
  }
}
