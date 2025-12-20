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
  BadRequestException,
} from '@nestjs/common';
import {
  DualAuthGuard,
  RequestWithCompanyEmployee,
} from 'src/Guards/dual-auth.guard';
import { StockService } from './stock.service';
import { StockGateway } from './stock.gateway';
import { EmployeeService } from '../employee/employee.service';
@Controller('stock')
@UseGuards(DualAuthGuard)
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly employeeService: EmployeeService,
    private readonly stockGateway: StockGateway,
  ) {}

  // 🔹 Helper: always resolve companyId correctly
  private async resolveCompanyId(req: RequestWithCompanyEmployee): Promise<string> {
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
  async create(@Req() req: RequestWithCompanyEmployee, @Body() body: any) {
    const companyId = await this.resolveCompanyId(req);
    const employeeId = req.employee?.id || body.employeeId;

    const stock = await this.stockService.create({
      companyId,
      employeeId,
      name: body.name,
      sku: body.sku,
      quantity: body.quantity,
      unit: body.unit,
      purchasingPrice: body.purchasingPrice,
      subquantity: body.subquantity,
      purpose: body.purpose,
      sellingPrice: body.sellingPrice,
      reoderLevel: body.reoderLevel,
      description: body.description,
    });

    this.stockGateway.notifyCreated(stock);
    return stock;
  }

  // ================= FIND ALL =================
  @Get()
  async findAll(@Req() req: RequestWithCompanyEmployee) {
    const companyId = await this.resolveCompanyId(req);
    return this.stockService.findAll(companyId);
  }

  // ================= FIND BY PURPOSE =================
  @Get('/purpose/:purpose')
  async findAllByPurpose(
    @Param('purpose') purpose: 'EATING' | 'DRINKING',
    @Req() req: RequestWithCompanyEmployee,
  ) {
    const companyId = await this.resolveCompanyId(req);
    return this.stockService.findAllByPurpsose(companyId, purpose);
  }

  // ================= FIND ONE =================
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const companyId = await this.resolveCompanyId(req);
    return this.stockService.findOne(id, companyId);
  }

  // ================= UPDATE =================
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
  ) {
    const companyId = await this.resolveCompanyId(req);

    const updated = await this.stockService.update(id, companyId, body);
    this.stockGateway.notifyUpdated(updated);
    return updated;
  }

  // ================= DELETE =================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const companyId = await this.resolveCompanyId(req);

    await this.stockService.delete(id, companyId);
    this.stockGateway.notifyDeleted(id);
  }
}
