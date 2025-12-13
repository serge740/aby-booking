import {
  Controller, Post, Get, Put, Delete, Param,
  Body, Req, UseGuards, UploadedFiles, UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-item.service';
import { CompanyUploadConfig } from 'src/common/Utils/file-upload.util';
import {
  DualAuthGuard,
  RequestWithCompanyEmployee
} from 'src/Guards/dual-auth.guard';
import { EmployeeService } from 'src/Modules/employee/employee.service';


@Controller('menu-item')
@UseGuards(DualAuthGuard)
export class MenuItemController {
  constructor(
    private readonly service: MenuItemService,
    private readonly employeeService: EmployeeService,
  ) {}

  // 🔹 Resolve companyId once
  private async resolveCompanyId(
    req: RequestWithCompanyEmployee,
  ): Promise<string> {
    if (req.employee?.id) {
      const employee = await this.employeeService.findOne(req.employee.id);
      if (!employee) {
        throw new BadRequestException('Employee not Found');
      }
      return employee.companyId as string;
    }

    if (req.company?.id) {
      return req.company.id;
    }

    throw new BadRequestException('Company not Found');
  }

  // ================= CREATE =================
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImages', maxCount: 10 },
      ],
      CompanyUploadConfig,
    ),
  )
  async create(
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    const companyId = await this.resolveCompanyId(req);

    if (files?.mainImage) {
      body.mainImage = `/uploads/menu/${files.mainImage[0].filename}`;
    }
    if (files?.otherImages) {
      body.otherImages = files.otherImages.map(
        (f: any) => `/uploads/menu/${f.filename}`,
      );
    }

    return this.service.create(companyId, body);
  }

  // ================= FIND ALL (AUTH) =================
  @Get()
  async findAllAsCompany(@Req() req: RequestWithCompanyEmployee) {
    const companyId = await this.resolveCompanyId(req);
    return this.service.findAllByCompanyId(companyId);
  }

  // ================= FIND ALL (PUBLIC) =================
  @Get('all')
  findAll() {
    return this.service.findAll();
  }

  // ================= FIND BY COMPANY =================
  @Get('company/:id')
  findAllByCompanyId(@Param('id') id: string) {
    return this.service.findAllByCompanyId(id);
  }

  // ================= FIND ONE =================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ================= UPDATE =================
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImages', maxCount: 10 },
      ],
      CompanyUploadConfig,
    ),
  )
  async update(
    @Req() req: RequestWithCompanyEmployee,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    const companyId = await this.resolveCompanyId(req);

    if (files?.mainImage) {
      body.mainImage = `/uploads/menu/${files.mainImage[0].filename}`;
    }
    if (files?.otherImages) {
      body.otherImages = files.otherImages.map(
        (f: any) => `/uploads/menu/${f.filename}`,
      );
    }

    return this.service.update(companyId, id, body);
  }

  // ================= DELETE =================
  @Delete(':id')
  async delete(
    @Req() req: RequestWithCompanyEmployee,
    @Param('id') id: string,
  ) {
    const companyId = await this.resolveCompanyId(req);
    return this.service.delete(companyId, id);
  }
}
