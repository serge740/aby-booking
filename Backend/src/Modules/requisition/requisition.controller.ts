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
  BadRequestException,
} from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { RequisitionGateway } from './requisition.gateway';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';
import { UseGuards } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';

@Controller('requisition')
@UseGuards(DualAuthGuard)
export class RequisitionController {
  constructor(
    private readonly service: RequisitionService,
        private readonly employeeService: EmployeeService,
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

  // GET RECEIVING SUMMARY
  @Get(':id/receiving-summary')
  async getReceivingSummary(@Param('id') id: string) {
    return this.service.getReceivingSummary(id);
  }

  // UPDATE (employee only, PENDING status only)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: RequestWithCompanyEmployee,
  ) {
    const employeeId = req.employee?.id;

    if (!employeeId)
      throw new UnauthorizedException('Only employees can update requisitions');

    const updated: any = await this.service.updateRequisition(id, employeeId, body);

    this.gateway.notifyUpdated(updated?.companyId, updated);
    return updated;
  }

  // APPROVE (Admin only)
  @Put(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company)
      throw new UnauthorizedException('Only company accounts can approve requisitions');

    // Get the approver employee ID (assuming company user has associated employee)
    // You may need to adjust this based on your auth structure
   

    const approved = await this.service.approveRequisition(
      id, 
      req.company.id, 
      
      body
    );

    this.gateway.notifyApproved(req.company.id, approved);
    return approved;
  }

  // RECEIVE ITEMS (Admin only)
  @Put(':id/receive')
  async receiveItems(
    @Param('id') id: string,
    @Body() body: { 
      items: { 
        itemId: string; 
        receivedQty: number;
        note?: string;
      }[] 
    },
    @Req() req: RequestWithCompanyEmployee,
  ) {

    let employee = null as any;

      if(req?.employee?.id){ 
           employee = await this.employeeService.findOne(req.employee.id)
          }
   
    // Get the receiver employee ID
    const receivedById = req.employee?.id || req?.company?.id;

    const updated = await this.service.receiveItems(
      id,
      req?.company?.id || employee?.companyId,
      receivedById,
      body.items
    );

    this.gateway.notifyReceived(req?.company?.id || employee?.companyId, updated);
    return updated;
  }

  // REJECT (Admin only)
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