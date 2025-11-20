import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // CREATE STOCK ITEM
  async create(data: {
    companyId: string;
    employeeId?: string;
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    price: number;
    description?: string;
  }) {
    
    return this.prisma.stock.create({
      data,
    });
  }

  // FIND ALL FOR COMPANY
  async findAll(companyId: string) {
    return this.prisma.stock.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // FIND BY EMPLOYEE
  async findAllByEmployee(employeeId: string) {
    return this.prisma.stock.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // SINGLE ITEM
  async findOne(id: string, companyId: string) {
    const stock = await this.prisma.stock.findFirst({
      where: { id, companyId },
    });

    if (!stock) throw new NotFoundException('Stock item not found');

    return stock;
  }

  async findOneByEmployee(id: string, employeeId: string) {
    const stock = await this.prisma.stock.findFirst({
      where: { id, employeeId },
    });

    if (!stock) throw new NotFoundException('Stock item not found');

    return stock;
  }

  // UPDATE STOCK
  async update(
    id: string,
    ownerId: string,
    data: { name?: string; price?: number; description?: string; quantity?: number; unit?: string }
  ) {
    const record =
      (await this.findOne(id, ownerId).catch(() =>
        this.findOneByEmployee(id, ownerId),
      )) || null;

    if (!record) throw new NotFoundException('Stock item not found');

    return this.prisma.stock.update({
      where: { id },
      data,
    });
  }

  // DELETE STOCK
  async delete(id: string, ownerId: string) {
    const record =
      (await this.findOne(id, ownerId).catch(() =>
        this.findOneByEmployee(id, ownerId),
      )) || null;

    if (!record) throw new NotFoundException('Stock item not found');

    return this.prisma.stock.delete({ where: { id } });
  }
}
