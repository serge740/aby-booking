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

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RiskReportService } from './risk-report.service';
import { RiskReportGateway } from './risk-report.gateway';

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
  constructor(
    private readonly riskReportService: RiskReportService,
    private readonly riskReportGateway: RiskReportGateway,
  ) {}

  // CREATE
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

    const report = await this.riskReportService.createRiskReport({
      employeeId,
      companyId,
      title: body.title,
      description: body.description,
      severity: body.severity,
      attachments,
    });

    // 🔥 Emit event
    this.riskReportGateway.notifyRiskReportCreated(report);

    return report;
  }

  // GET ALL
  @Get()
  findAll(@Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.riskReportService.findAllByCompany(req.company.id)
      : this.riskReportService.findAllByEmployee(req.employee.id);
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.riskReportService.findOne(id, req.company.id)
      : this.riskReportService.findOneByEmployee(id, req.employee.id);
  }

  // UPDATE
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
  async update(
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

    const updated = await this.riskReportService.updateRiskReport(id, ownerId, {
      title: body.title,
      description: body.description,
      severity: body.severity,
      attachments,
    });

    // 🔥 Emit event
    this.riskReportGateway.notifyRiskReportUpdated(updated);

    return updated;
  }

  // RESOLVE
  @Put(':id/resolve')
  async resolve(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company)
      throw new UnauthorizedException('Only companies can resolve reports');

    const resolved = await this.riskReportService.resolveReport(id, req.company.id);

    // 🔥 Emit event
    this.riskReportGateway.notifyRiskReportResolved(resolved);

    return resolved;
  }

  // REJECT
  @Put(':id/reject')
  async reject(
    @Param('id') id: string,
    @Req() req: RequestWithCompanyEmployee,
    @Body('reason') reason: string,
  ) {
    if (!req.company)
      throw new UnauthorizedException('Only companies can reject reports');

    const rejected = await this.riskReportService.rejectReport(id, req.company.id, reason);

    // 🔥 Emit event
    this.riskReportGateway.notifyRiskReportRejected(rejected);

    return rejected;
  }

  // DELETE
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const ownerId = req.company?.id || req.employee?.id;

    await this.riskReportService.deleteReport(id, ownerId);

    // 🔥 Emit event
    this.riskReportGateway.notifyRiskReportDeleted(id);
  }
}
