import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { RequisitionStatus, StockPurposeStatus } from 'generated/prisma';

@Injectable()
export class RequisitionService {
  constructor(private prisma: PrismaService) {}

  // ───────────────────────────────────
  // CREATE REQUISITION
  // ───────────────────────────────────
  async createRequisition(data: {
    employeeId: string;
    companyId: string;
    description?: string;
    items: {
      itemName: string;
      quantity: number;
      unit?: string;
      purpose?: string;
      note?: string;
      stockId?: string;
    }[];
  }) {
    if (!data.items || data.items.length === 0)
      throw new BadRequestException('Requisition must have at least one item');

    const employee = await this.prisma.employee.findUnique({where:{id:data.employeeId}}) as any;

    if (!employee) {
        throw new BadRequestException('Employee not found')
    }

    return this.prisma.requisition.create({
      data: {
        employeeId: data.employeeId,
        companyId: data.companyId  || employee?.companyId,
        description: data.description,
        status: RequisitionStatus.PENDING,
        items: {
          create: data.items.map((i) => ({
            itemName: i.itemName,
            quantity: i.quantity,
            unit: i.unit ?? "",
            purpose: (i.purpose as StockPurposeStatus) ?? "EATING",
            note: i.note,
            stockId: i.stockId || null,
          })),
        },
      },
      include: { items: true, employee: true, company: true },
    });
  }

  // ───────────────────────────────────
  // UPDATE PENDING REQUISITION
  // employee only
  // ───────────────────────────────────
  async updateRequisition(
    id: string,
    employeeId: string,
    data: {
      description?: string;
      items?: any[];
    },
  ) {
    const req = await this.prisma.requisition.findFirst({
      where: { id, employeeId },
      include: { items: true },
    });

    if (!req) throw new NotFoundException('Requisition not found');
    if (req.status !== 'PENDING')
      throw new ForbiddenException('Only pending requisitions can be updated');

    // Update description
    if (data.description) {
      await this.prisma.requisition.update({
        where: { id },
        data: { description: data.description },
      });
    }

    // Update items
    if (data.items) {
      for (const item of data.items) {
        // Remove item
        if (item.remove && item.id) {
          await this.prisma.requisitionItem.delete({ where: { id: item.id } });
          continue;
        }

        // Update existing item
        if (item.id) {
          await this.prisma.requisitionItem.update({
            where: { id: item.id },
            data: {
              itemName: item.itemName,
              quantity: item.quantity,
              unit: item.unit ?? "",
              note: item.note,
              purpose: (item.purpose as StockPurposeStatus) ?? "EATING",
            },
          });
        } else {
          // Create new item
          await this.prisma.requisitionItem.create({
            data: {
              requisitionId: id,
              itemName: item.itemName,
              quantity: item.quantity,
              unit: item.unit ?? "",
              purpose: (item.purpose as StockPurposeStatus) ?? "EATING",
              note: item.note,
            },
          });
        }
      }
    }

    return this.prisma.requisition.findUnique({
      where: { id },
      include: { items: true, employee: true, company: true },
    });
  }

  // ───────────────────────────────────
  // APPROVE (Admin)
  // Admin can edit items + update stock
  // ───────────────────────────────────
  async approveRequisition(id: string, companyId: string, body: { items: any[] }) {
    const req = await this.prisma.requisition.findFirst({
      where: { id, companyId },
      include: { items: true },
    });

    if (!req) throw new NotFoundException('Requisition not found');
    if (req.status !== 'PENDING')
      throw new ForbiddenException('Only pending requisitions can be approved');

    // Apply admin edits
    for (const i of body.items) {
      if (i.remove && i.id) {
        await this.prisma.requisitionItem.delete({ where: { id: i.id } });
        continue;
      }

      if (i.id) {
        await this.prisma.requisitionItem.update({
          where: { id: i.id },
          data: {
            itemName: i.itemName,
            quantity: i.quantity,
            unit: i.unit ?? "",
            purpose: (i.purpose as StockPurposeStatus) ?? "EATING",
            note: i.note,
          },
        });
      } else {
        await this.prisma.requisitionItem.create({
          data: {
            requisitionId: id,
            itemName: i.itemName,
            quantity: i.quantity,
            unit: i.unit ?? "",
            purpose: (i.purpose as StockPurposeStatus) ?? "EATING",
            note: i.note,
          },
        });
      }
    }

    // Fetch updated items
    const finalItems = await this.prisma.requisitionItem.findMany({
      where: { requisitionId: id },
    });

    // Update stock operations
    for (const item of finalItems) {
      if (item.stockId) {
        // Add to existing stock
        await this.prisma.stock.update({
          where: { id: item.stockId },
          data: { quantity: { increment: item.quantity } },
        });
      } else {
        // Create new stock entry
        const newStock = await this.prisma.stock.create({
          data: {
            companyId,
            employeeId: req.employeeId,
            name: item.itemName,
            sku: `SKU-${Date.now()}`,
            quantity: item.quantity,
            unit: item.unit ?? "",
            purpose: (item.purpose as StockPurposeStatus) ?? "EATING",
            sellingPrice: 0,
            reoderLevel: 0,
          },
        });

        await this.prisma.requisitionItem.update({
          where: { id: item.id },
          data: { stockId: newStock.id },
        });
      }
    }

    return this.prisma.requisition.update({
      where: { id },
      data: { status: RequisitionStatus.APPROVED },
      include: { items: true, employee: true, company: true },
    });
  }

  // ───────────────────────────────────
  // REJECT (Admin)
  // ───────────────────────────────────
  async rejectRequisition(id: string, companyId: string, reason: string) {
    if (!reason) throw new BadRequestException('Rejection reason required');

    const req = await this.prisma.requisition.findFirst({
      where: { id, companyId },
    });

    if (!req) throw new NotFoundException('Requisition not found');
    if (req.status !== 'PENDING')
      throw new ForbiddenException('Only pending requisitions can be rejected');

    return this.prisma.requisition.update({
      where: { id },
      data: {
        status: RequisitionStatus.REJECTED,
        rejectReason: reason,
      },
      include: { items: true, employee: true, company: true },
    });
  }

  // DELETE
  async delete(id: string) {
    return this.prisma.requisition.delete({ where: { id } });
  }

  // FIND ALL (Admin)
  async findAll(companyId: string) {
    return this.prisma.requisition.findMany({
      where: { companyId },
      include: { items: true, employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // FIND MY (Employee)
  async findByEmployee(employeeId: string) {
    return this.prisma.requisition.findMany({
      where: { employeeId },
      include: { items: true, company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.requisition.findUnique({
      where: { id },
      include: { items: true, employee: true, company: true },
    });
  }
}
