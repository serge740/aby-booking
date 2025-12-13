import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // CREATE PERMISSION
  // ──────────────────────────────────────────────
  async createPermission(data: { name: string; description?: string }) {
    try {
      return await this.prisma.permission.create({
        data,
      });
    } catch (e) {
      throw new BadRequestException('Permission already exists or invalid data');
    }
  }

  // ──────────────────────────────────────────────
  // GET ALL PERMISSIONS
  // ──────────────────────────────────────────────
  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
    // ──────────────────────────────────────────────
  // GET SINGLE PERMISSION
  // ──────────────────────────────────────────────
  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

    // ──────────────────────────────────────────────
  // UPDATE PERMISSION
  // ──────────────────────────────────────────────
  async updatePermission(id: string, data: { name?: string; description?: string }) {
    await this.findOne(id); // ensure it exists
    try {
      return await this.prisma.permission.update({ where: { id }, data });
    } catch (e) {
      throw new BadRequestException('Failed to update permission');
    }
  }

  

  // ──────────────────────────────────────────────
  // DELETE PERMISSION
  // ──────────────────────────────────────────────
async deletePermission(id: string) {
  // Make sure the permission exists
  const permission = await this.prisma.permission.findUnique({ where: { id } });
  if (!permission) throw new NotFoundException('Permission not found');

  // Delete all employee-permission associations first
  await this.prisma.employeePermission.deleteMany({
    where: { permissionId: id },
  });

  // Now delete the permission itself
  return this.prisma.permission.delete({ where: { id } });
}


  // ──────────────────────────────────────────────
  // ASSIGN PERMISSION TO EMPLOYEE
  // ──────────────────────────────────────────────
  async assignPermission(employeeId: string, permissionId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const permission = await this.prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) throw new NotFoundException('Permission not found');

    return this.prisma.employeePermission.create({
      data: { employeeId, permissionId },
      include: { permission: true, employee: true },
    });
  }

  // ──────────────────────────────────────────────
  // REMOVE PERMISSION FROM EMPLOYEE
  // ──────────────────────────────────────────────
  async removePermission(employeeId: string, permissionId: string) {
    return this.prisma.employeePermission.delete({
      where: {
        employeeId_permissionId: { employeeId, permissionId },
      },
    });
  }

  // ──────────────────────────────────────────────
  // GET PERMISSIONS OF EMPLOYEE
  // ──────────────────────────────────────────────
  async getPermissionsByEmployee(employeeId: string) {
    return this.prisma.employeePermission.findMany({
      where: { employeeId },
      include: { permission: true },
    });
  }

  // ──────────────────────────────────────────────
  // GET EMPLOYEES WHO HAVE A PERMISSION
  // ──────────────────────────────────────────────
  async getEmployeesByPermission(permissionId: string) {
    return this.prisma.employeePermission.findMany({
      where: { permissionId },
      include: { employee: true },
    });
  }
}
