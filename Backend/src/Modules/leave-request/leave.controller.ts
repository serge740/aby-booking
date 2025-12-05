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
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LeaveService } from './leave.service';
import { LeaveUploadConfig, LeaveFileFields } from 'src/common/Utils/file-upload.util';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';
import { LeaveGateway } from './leave.gateway';

@Controller('leave')
@UseGuards(DualAuthGuard) // ✅ Use the combined guard
export class LeaveController {
  constructor(
  private readonly leaveService: LeaveService,
  private readonly leaveGateway: LeaveGateway,
) {}

  // CREATE LEAVE REQUEST WITH FILES
@Post()
@UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
async createLeave(
  @UploadedFiles() files: { attachments?: Express.Multer.File[] },
  @Req() req: RequestWithCompanyEmployee,
  @Body() body: any,
) {
  const attachments = files.attachments?.map(file => ({
    filename: file.originalname,
    url: `/uploads/attachments/${file.filename}`,
    mimeType: file.mimetype,
  })) || [];

  const employeeId = req.employee?.id || body.employeeId;
  const companyId = req.company?.id || body.companyId;

  const leave = await this.leaveService.createLeaveRequest({
    employeeId,
    companyId,
    type: body.type,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    reasonForRequest: body.reasonForRequest,
    attachments,
  });

  this.leaveGateway.notifyLeaveCreated(companyId, leave);

  return leave;
}


  // GET ALL LEAVES
  @Get()
  findAll(@Req() req: RequestWithCompanyEmployee) {
    const companyId = req.company?.id;
    const employeeId = req.employee?.id;
    return companyId
      ? this.leaveService.findAll(companyId)
      : this.leaveService.findAllByEmployee(employeeId);
  }

  // GET ONE LEAVE
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const companyId = req.company?.id;
    const employeeId = req.employee?.id;
    return companyId
      ? this.leaveService.findOne(id, companyId)
      : this.leaveService.findOneByEmployee(id, employeeId);
  }

  // UPDATE LEAVE REQUEST WITH FILES
@Put(':id')
@UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
async updateLeave(
  @UploadedFiles() files: { attachments?: Express.Multer.File[] },
  @Param('id') id: string,
  @Req() req: RequestWithCompanyEmployee,
  @Body() body: any,
) {
  const attachments = files.attachments?.map(file => ({
    filename: file.originalname,
    url: `/uploads/leave/${file.filename}`,
    mimeType: file.mimetype,
  }));

  const companyId = req.company?.id;
  const employeeId = req.employee?.id;

  const updated = await this.leaveService.updateLeave(
    id,
    companyId || employeeId,
    {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      attachments,
    },
  );

  this.leaveGateway.notifyLeaveUpdated(updated.companyId, updated);

  return updated;
}


  // APPROVE (only company)
@Put(':id/approve')
async approve(
  @Body('reason') reason: string,
  @Param('id') id: string,
  @Req() req: RequestWithCompanyEmployee
) {
  if (!req.company) throw new UnauthorizedException('Only companies can approve leave');

  const approved = await this.leaveService.approveLeave(id, req.company.id, reason);

  this.leaveGateway.notifyLeaveApproved(approved.companyId, approved);

  return approved;
}



  // REJECT (only company)
@Put(':id/reject')
async reject(
  @Param('id') id: string,
  @Req() req: RequestWithCompanyEmployee,
  @Body('reasonForRejection') reason: string,
) {
  if (!req.company) throw new UnauthorizedException('Only companies can reject leave');

  const rejected = await this.leaveService.rejectLeave(id, req.company.id, reason);

  this.leaveGateway.notifyLeaveRejected(rejected.companyId, rejected);

  return rejected;
}



  // DELETE (company or employee)
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
  const companyId = req.company?.id;
  const employeeId = req.employee?.id;

  const leave = await this.leaveService.deleteLeave(id, companyId || employeeId);

  this.leaveGateway.notifyLeaveDeleted(leave.companyId, id);
  return leave;
}

}
