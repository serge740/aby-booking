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
} from '@nestjs/common';
import {
  DualAuthGuard,
  RequestWithCompanyEmployee,
} from 'src/Guards/dual-auth.guard';
import { StockService } from './stock.service';
import { StockGateway } from './stock.gateway';

@Controller('stock')
@UseGuards(DualAuthGuard)
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly stockGateway: StockGateway,
  ) {}

  @Post()
  async create(@Req() req: RequestWithCompanyEmployee, @Body() body: any) {
    const companyId = req.company?.id || body.companyId;
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

  @Get()
  findAll(@Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.stockService.findAll(req.company.id)
      : this.stockService.findAllByEmployee(req.employee.id);
  }
  @Get('/purpose/:purpose')
  findAllByPurpose(@Param('purpose') purpose:'EATING' | 'DRINKING' ,@Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.stockService.findAllByPurpsose(req.company.id,purpose)
      : this.stockService.findAllByPurpsose(req.company.id,purpose);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    return req.company
      ? this.stockService.findOne(id, req.company.id)
      : this.stockService.findOneByEmployee(id, req.employee.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: any,
  ) {
    const ownerId = req.company?.id || req.employee?.id;

    const updated = await this.stockService.update(id, ownerId, body);
    this.stockGateway.notifyUpdated(updated);

    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const ownerId = req.company?.id || req.employee?.id;

    await this.stockService.delete(id, ownerId);
    this.stockGateway.notifyDeleted(id);
  }
}
