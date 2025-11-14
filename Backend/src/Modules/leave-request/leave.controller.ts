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

@Controller('leave')
@UseGuards(DualAuthGuard) // ✅ Use the combined guard
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // CREATE LEAVE REQUEST WITH FILES
  @Post()
  @UseInterceptors(FileFieldsInterceptor(LeaveFileFields, LeaveUploadConfig))
  async createLeave(
    @UploadedFiles()
    files: { attachments?: Express.Multer.File[] },
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
  ) {
    const attachments = files.attachments?.map(file => ({
      filename: file.originalname,
      url: `/uploads/attachments/${file.filename}`,
      mimeType: file.mimetype,
    })) || [];

    // Determine employeeId and companyId depending on who is logged in
    console.log(req.employee);
    
    const employeeId = req.employee?.id || body.employeeId;
    const companyId = req.company?.id || body.companyId;

    return this.leaveService.createLeaveRequest({
      employeeId,
      companyId,
      type: body.type,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      reasonForRequest: body.reasonForRequest,
      attachments,
    });
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
  updateLeave(
    @UploadedFiles()
    files: { attachments?: Express.Multer.File[] },
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

    return this.leaveService.updateLeave(
      id,
      companyId || employeeId, // use company if exists, else employee
      {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        attachments,
      },
    );
  }

  // APPROVE (only company)
  @Put(':id/approve')
  approve(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company) throw new UnauthorizedException('Only companies can approve leave');
    return this.leaveService.approveLeave(id, req.company.id);
  }

  // REJECT (only company)
  @Put(':id/reject')
  reject(
    @Param('id') id: string,
    @Req() req: RequestWithCompanyEmployee,
    @Body('reasonForRejection') reason: string,
  ) {
    if (!req.company) throw new UnauthorizedException('Only companies can reject leave');
    return this.leaveService.rejectLeave(id, req.company.id, reason);
  }

  // DELETE (company or employee)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const companyId = req.company?.id;
    const employeeId = req.employee?.id;
    return this.leaveService.deleteLeave(id, companyId || employeeId);
  }
}
