import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { RequisitionGateway } from './requisition.gateway';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('requisition')
@UseGuards(DualAuthGuard)
export class RequisitionController {
  constructor(
    private readonly service: RequisitionService,
    private readonly gateway: RequisitionGateway,
  ) {}

  // CREATE
  @Post()
  async create(@Body() body: any, @Req() req: RequestWithCompanyEmployee) {
    const employeeId = req.employee?.id;
    const companyId = req.company?.id || body.companyId;

    const requisition = await this.service.createRequisition({
      employeeId,
      companyId,
      description: body.description,
      items: body.items,
    });

    this.gateway.notifyCreated(companyId, requisition);
    return requisition;
  }

  // GET ALL
  @Get()
  async findAll(@Req() req: RequestWithCompanyEmployee) {
    if (req.company) return this.service.findAll(req.company.id);
    return this.service.findByEmployee(req.employee.id);
  }

  // GET ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // UPDATE (employee only)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: RequestWithCompanyEmployee,
  ) {
    const employeeId = req.employee?.id;

    if (!employeeId)
      throw new UnauthorizedException('Only employees can update requisitions');

    const updated : any = await this.service.updateRequisition(id, employeeId, body);

    this.gateway.notifyUpdated(updated?.companyId, updated);
    return updated;
  }

  // APPROVE
  @Put(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company)
      throw new UnauthorizedException('Only company accounts can approve requisitions');

    const approved = await this.service.approveRequisition(id, req.company.id, body);

    this.gateway.notifyApproved(req.company.id, approved);
    return approved;
  }

  // REJECT
  @Put(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company)
      throw new UnauthorizedException('Only company accounts can reject requisitions');

    const rejected = await this.service.rejectRequisition(id, req.company.id, reason);

    this.gateway.notifyRejected(req.company.id, rejected);
    return rejected;
  }

  // DELETE
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const deleted = await this.service.delete(id);

    this.gateway.notifyDeleted(req.company?.id || req.employee?.companyId, id);
    return deleted;
  }
}
