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
import { PreSalaryGateway } from './pre-salary.gateway';

@Controller('pre-salary')
@UseGuards(DualAuthGuard)
export class PreSalaryController {
  constructor(
    private readonly preSalaryService: PreSalaryService,
    private readonly preSalaryGateway: PreSalaryGateway,
  ) {}

 @Post()
async createPreSalary(@Req() req: RequestWithCompanyEmployee, @Body() body: any) {
  const employeeId = req.employee?.id || body.employeeId;
  const companyId = req.company?.id || body.companyId;

  const presalary = await this.preSalaryService.createPreSalary({
    employeeId,
    companyId,
    amount: body.amount,
    currency: body.currency,
    periodStart: new Date(body.periodStart),
    periodEnd: new Date(body.periodEnd),
    reason: body.reason,
  });

  this.preSalaryGateway.notifyPreSalaryCreated(companyId, presalary);

  return presalary;
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
async updatePreSalary(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee, @Body() body: any) {
  const ownerId = req.company?.id || req.employee?.id;

  const updated = await this.preSalaryService.updatePreSalary(id, ownerId, {
    amount: body.amount,
    currency: body.currency,
    periodStart: body.periodStart ? new Date(body.periodStart) : undefined,
    periodEnd: body.periodEnd ? new Date(body.periodEnd) : undefined,
    reason: body.reason,
  });

  this.preSalaryGateway.notifyPreSalaryUpdated(updated.companyId, updated);

  return updated;
}


@Put(':id/approve')
async approve(
  @Body('reason') reason: string,
  @Param('id') id: string,
  @Req() req: RequestWithCompanyEmployee
) {
  if (!req.company) throw new UnauthorizedException('Only companies can approve');

  const approved = await this.preSalaryService.approvePreSalary(id, req.company.id, reason);

  this.preSalaryGateway.notifyPreSalaryApproved(approved.companyId, approved);

  return approved;
}


@Put(':id/reject')
async reject(
  @Param('id') id: string,
  @Req() req: RequestWithCompanyEmployee,
  @Body('reason') reason: string
) {
  if (!req.company) throw new UnauthorizedException('Only companies can reject');

  const rejected = await this.preSalaryService.rejectPreSalary(id, req.company.id, reason);

  this.preSalaryGateway.notifyPreSalaryRejected(rejected.companyId, rejected);

  return rejected;
}


@Delete(':id')
async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
  const ownerId = req.company?.id || req.employee?.id;

  const presalary = await this.preSalaryService.deletePreSalary(id, ownerId);

  this.preSalaryGateway.notifyPreSalaryDeleted(presalary.companyId, id);
}

}
