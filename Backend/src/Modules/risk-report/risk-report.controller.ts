import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';

import { RiskReportService } from './risk-report.service';
import {
  DualAuthGuard,
  RequestWithCompanyEmployee,
} from 'src/Guards/dual-auth.guard';

import {
  LeaveFileFields,
  LeaveUploadConfig,
} from 'src/common/Utils/file-upload.util';

@Controller('risk-report')
@UseGuards(DualAuthGuard)
export class RiskReportController {
  constructor(private readonly riskReportService: RiskReportService) {}

  // ──────────────────────────────────────
  // CREATE RISK REPORT + FILE UPLOAD
  // ──────────────────────────────────────
  @Post()
  @UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
  async create(
    @UploadedFiles()
    files: { attachments?: Express.Multer.File[] },
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
  ) {
    const employeeId = req.employee?.id || body.employeeId;
    const companyId = req.company?.id || body.companyId;

    const attachments =
      files.attachments?.map((file) => ({
        filename: file.originalname,
        url: `/uploads/attachments/${file.filename}`,
        mimeType: file.mimetype,
      })) || [];

    return this.riskReportService.createRiskReport({
      employeeId,
      companyId,
      title: body.title,
      description: body.description,
      severity: body.severity,
      attachments,
    });
  }

  // ──────────────────────────────────────
  // GET ALL
  // ──────────────────────────────────────
  @Get()
  findAll(@Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.riskReportService.findAllByCompany(req.company.id)
      : this.riskReportService.findAllByEmployee(req.employee.id);
  }

  // ──────────────────────────────────────
  // GET ONE
  // ──────────────────────────────────────
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.riskReportService.findOne(id, req.company.id)
      : this.riskReportService.findOneByEmployee(id, req.employee.id);
  }

  // ──────────────────────────────────────
  // UPDATE + FILE UPLOAD
  // ──────────────────────────────────────
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { attachments?: Express.Multer.File[] },
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
  ) {
    const ownerId = req.company?.id || req.employee?.id;

    const attachments =
      files.attachments?.map((file) => ({
        filename: file.originalname,
        url: `/uploads/attachments/${file.filename}`,
        mimeType: file.mimetype,
      })) || undefined;

    return this.riskReportService.updateRiskReport(id, ownerId, {
      title: body.title,
      description: body.description,
      severity: body.severity,
      attachments,
    });
  }

  // ──────────────────────────────────────
  // RESOLVE
  // ──────────────────────────────────────
  @Put(':id/resolve')
  resolve(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company)
      throw new UnauthorizedException('Only companies can resolve reports');

    return this.riskReportService.resolveReport(id, req.company.id);
  }

  // ──────────────────────────────────────
  // REJECT
  // ──────────────────────────────────────
  @Put(':id/reject')
  reject(
    @Param('id') id: string,
    @Req() req: RequestWithCompanyEmployee,
    @Body('reason') reason: string,
  ) {
    if (!req.company)
      throw new UnauthorizedException('Only companies can reject reports');

    return this.riskReportService.rejectReport(id, req.company.id, reason);
  }

  // ──────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const ownerId = req.company?.id || req.employee?.id;
    return this.riskReportService.deleteReport(id, ownerId);
  }
}
