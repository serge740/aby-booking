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
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PreSalaryService } from './pre-salary.service';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';

@Controller('pre-salary')
@UseGuards(DualAuthGuard)
export class PreSalaryController {
  constructor(private readonly preSalaryService: PreSalaryService) {}

  @Post()
  async createPreSalary(@Req() req: RequestWithCompanyEmployee, @Body() body: any) {
    const employeeId = req.employee?.id || body.employeeId;
    const companyId = req.company?.id || body.companyId;

    return this.preSalaryService.createPreSalary({
      employeeId,
      companyId,
      amount: body.amount,
      currency: body.currency,
      periodStart: new Date(body.periodStart),
      periodEnd: new Date(body.periodEnd),
      reason: body.reason,
    });
  }

  @Get()
  findAll(@Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.preSalaryService.findAll(req.company.id)
      : this.preSalaryService.findAllByEmployee(req.employee.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.preSalaryService.findOne(id, req.company.id)
      : this.preSalaryService.findOneByEmployee(id, req.employee.id);
  }

  @Put(':id')
  updatePreSalary(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee, @Body() body: any) {
    const ownerId = req.company?.id || req.employee?.id;
    return this.preSalaryService.updatePreSalary(id, ownerId, {
      amount: body.amount,
      currency: body.currency,
      periodStart: body.periodStart ? new Date(body.periodStart) : undefined,
      periodEnd: body.periodEnd ? new Date(body.periodEnd) : undefined,
      reason: body.reason,
    });
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company) throw new UnauthorizedException('Only companies can approve');
    return this.preSalaryService.approvePreSalary(id, req.company.id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee, @Body('reason') reason: string) {
    if (!req.company) throw new UnauthorizedException('Only companies can reject');
    return this.preSalaryService.rejectPreSalary(id, req.company.id, reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const ownerId = req.company?.id || req.employee?.id;
    return this.preSalaryService.deletePreSalary(id, ownerId);
  }
}
