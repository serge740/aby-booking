import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionGateway } from './permission.gateway';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';

@Controller('permissions')
@UseGuards(DualAuthGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly permissionGateway: PermissionGateway,
  ) {}

  // ──────────────────────────────────────────────
  // CREATE PERMISSION
  // ──────────────────────────────────────────────
  @Post()
  async createPermission(@Body() body: any, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company) throw new UnauthorizedException('Only company can create permissions');

    const permission = await this.permissionService.createPermission(body);

    this.permissionGateway.notifyPermissionCreated(req.company.id, permission);

    return permission;
  }

  // ──────────────────────────────────────────────
  // GET ALL PERMISSIONS
  // ──────────────────────────────────────────────
  @Get()
  async findAll() {
    return this.permissionService.findAll();
  }

  // ──────────────────────────────────────────────
  // ASSIGN PERMISSION TO EMPLOYEE
  // ──────────────────────────────────────────────
  @Post('assign')
  async assignPermission(
    @Body() body: { permissionId: string; employeeId: string },
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company) throw new UnauthorizedException('Only companies can assign');

    const result = await this.permissionService.assignPermission(body.employeeId, body.permissionId);

    this.permissionGateway.notifyPermissionAssigned(req.company.id, result);

    return result;
  }

  // ──────────────────────────────────────────────
  // REMOVE PERMISSION FROM EMPLOYEE
  // ──────────────────────────────────────────────
  @Delete('remove')
  async removePermission(
    @Body() body: { permissionId: string; employeeId: string },
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company) throw new UnauthorizedException('Only companies can remove');

    const result = await this.permissionService.removePermission(body.employeeId, body.permissionId);

    this.permissionGateway.notifyPermissionRemoved(req.company.id, {
      employeeId: body.employeeId,
      permissionId: body.permissionId,
    });

    return result;
  }

  // ──────────────────────────────────────────────
  // UPDATE PERMISSION
  // ──────────────────────────────────────────────
  @Put(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
    @Req() req: RequestWithCompanyEmployee,
  ) {
    if (!req.company) throw new UnauthorizedException('Only company can update permissions');

    const updated = await this.permissionService.updatePermission(id, body);
    this.permissionGateway.notifyPermissionCreated(req.company.id, updated); // reuse event
    return updated;
  }

  // ──────────────────────────────────────────────
  // DELETE PERMISSION
  // ──────────────────────────────────────────────
  @Delete(':id')
  async deletePermission(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    if (!req.company) throw new UnauthorizedException('Only company can delete permissions');

    const deleted = await this.permissionService.deletePermission(id);
    this.permissionGateway.notifyPermissionRemoved(req.company.id, { permissionId: id });
    return deleted;
  }


  // ──────────────────────────────────────────────
  // GET PERMISSIONS OF EMPLOYEE
  // ──────────────────────────────────────────────
  @Get('employee/:id')
  async getEmployeePermissions(@Param('id') id: string) {
    return this.permissionService.getPermissionsByEmployee(id);
  }

  // ──────────────────────────────────────────────
  // GET EMPLOYEES WHO HAVE A PERMISSION
  // ──────────────────────────────────────────────
  @Get(':id/employees')
  async getEmployeesForPermission(@Param('id') id: string) {
    return this.permissionService.getEmployeesByPermission(id);
  }
}
