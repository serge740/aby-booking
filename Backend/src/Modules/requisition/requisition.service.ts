import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { RequisitionStatus, StockPurposeStatus, ReceivingStatus } from 'generated/prisma';

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

    const employee = await this.prisma.employee.findUnique({
      where: { id: data.employeeId },
    }) as any;

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    return this.prisma.requisition.create({
      data: {
        employeeId: data.employeeId,
        companyId: data.companyId || employee?.companyId,
        description: data.description,
        status: RequisitionStatus.PENDING,
        items: {
          create: data.items.map((i) => ({
            itemName: i.itemName,
            quantity: i.quantity,
            unit: i.unit ?? '',
            purpose: (i.purpose as StockPurposeStatus) ?? 'EATING',
            note: i.note,
            stockId: i.stockId || null,
            receivedQty: 0,
            receivingStatus: ReceivingStatus.NOT_RECEIVED,
          })),
        },
      },
      include: { 
        items: { include: { receivingLogs: true } }, 
        employee: true, 
        company: true 
      },
    });
  }

  // ───────────────────────────────────
  // UPDATE PENDING REQUISITION (Employee Only)
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
    if (data.description !== undefined) {
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
              unit: item.unit ?? '',
              note: item.note,
              purpose: (item.purpose as StockPurposeStatus) ?? 'EATING',
              stockId: item.stockId || null,
            },
          });
        } else {
          // Create new item
          await this.prisma.requisitionItem.create({
            data: {
              requisitionId: id,
              itemName: item.itemName,
              quantity: item.quantity,
              unit: item.unit ?? '',
              purpose: (item.purpose as StockPurposeStatus) ?? 'EATING',
              note: item.note,
              stockId: item.stockId || null,
              receivedQty: 0,
              receivingStatus: ReceivingStatus.NOT_RECEIVED,
            },
          });
        }
      }
    }

    return this.prisma.requisition.findUnique({
      where: { id },
      include: { 
        items: { include: { receivingLogs: true } }, 
        employee: true, 
        company: true 
      },
    });
  }

  // ───────────────────────────────────
  // APPROVE (Admin)
  // Admin can edit items but NO stock updates
  // ───────────────────────────────────
  async approveRequisition(
    id: string, 
    companyId: string, 

    body: { items?: any[] }
  ) {
    const req = await this.prisma.requisition.findFirst({
      where: { id, companyId },
      include: { items: true },
    });

    if (!req) throw new NotFoundException('Requisition not found');
    if (req.status !== 'PENDING')
      throw new ForbiddenException('Only pending requisitions can be approved');

    // Apply admin edits if provided
    if (body.items) {
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
              unit: i.unit ?? '',
              purpose: (i.purpose as StockPurposeStatus) ?? 'EATING',
              note: i.note,
              stockId: i.stockId || null,
            },
          });
        } else {
          await this.prisma.requisitionItem.create({
            data: {
              requisitionId: id,
              itemName: i.itemName,
              quantity: i.quantity,
              unit: i.unit ?? '',
              purpose: (i.purpose as StockPurposeStatus) ?? 'EATING',
              note: i.note,
              stockId: i.stockId || null,
              receivedQty: 0,
              receivingStatus: ReceivingStatus.NOT_RECEIVED,
            },
          });
        }
      }
    }

    // Mark as approved (NO stock updates here)
    return this.prisma.requisition.update({
      where: { id },
      data: { 
        status: RequisitionStatus.APPROVED,
        approvedAt: new Date(),
      },
      include: { 
        items: { include: { receivingLogs: true } }, 
        employee: true, 
        company: true,
        
      },
    });
  }

  // ───────────────────────────────────
  // RECEIVE ITEMS (New Logic)
  // ───────────────────────────────────
  async receiveItems(
    requisitionId: string,
    companyId: string,
    receivedById: string,
    items: { 
      itemId: string; 
      receivedQty: number;
      note?: string;
    }[]
  ) {
    const req = await this.prisma.requisition.findFirst({
      where: { id: requisitionId, companyId },
      include: { items: true },
    });

    if (!req) throw new NotFoundException('Requisition not found');
    if (req.status !== RequisitionStatus.APPROVED && 
        req.status !== RequisitionStatus.PARTIALLY_RECEIVED)
      throw new ForbiddenException('Only approved requisitions can be received');

    // Process each item
    for (const receiveData of items) {
      const item = req.items.find(i => i.id === receiveData.itemId);
      
      if (!item) {
        throw new BadRequestException(`Item ${receiveData.itemId} not found`);
      }

      const newReceivedQty = item.receivedQty + receiveData.receivedQty;
      
      if (newReceivedQty > item.quantity) {
        throw new BadRequestException(
          `Cannot receive more than requested. Item: ${item.itemName}, ` +
          `Requested: ${item.quantity}, Already received: ${item.receivedQty}, ` +
          `Trying to receive: ${receiveData.receivedQty}`
        );
      }

      // Create receiving log
      await this.prisma.receivingLog.create({
        data: {
          requisitionItemId: item.id,
          receivedQty: receiveData.receivedQty,
          receivedById: receivedById,
          note: receiveData.note,
        },
      });

      // Determine receiving status
      let receivingStatus: ReceivingStatus;
      if (newReceivedQty >= item.quantity) {
        receivingStatus = ReceivingStatus.FULLY_RECEIVED;
      } else if (newReceivedQty > 0) {
        receivingStatus = ReceivingStatus.PARTIALLY_RECEIVED;
      } else {
        receivingStatus = ReceivingStatus.NOT_RECEIVED;
      }

      // Update item
      await this.prisma.requisitionItem.update({
        where: { id: item.id },
        data: {
          receivedQty: newReceivedQty,
          receivingStatus: receivingStatus,
        },
      });

      // Update stock
      if (item.stockId) {
        // Add to existing stock
        await this.prisma.stock.update({
          where: { id: item.stockId },
          data: { quantity: { increment: receiveData.receivedQty } },
        });
      } else {
        // Create new stock entry
        const newStock = await this.prisma.stock.create({
          data: {
            companyId,
            employeeId: req.employeeId,
            name: item.itemName,
            sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quantity: receiveData.receivedQty,
            unit: item.unit ?? '',
            purpose: item.purpose ?? 'EATING',
            sellingPrice: 0,
            reoderLevel: 0,
          },
        });

        // Link stock to item
        await this.prisma.requisitionItem.update({
          where: { id: item.id },
          data: { stockId: newStock.id },
        });
      }
    }

    // Check if all items are fully received
    const updatedItems = await this.prisma.requisitionItem.findMany({
      where: { requisitionId },
    });

    const allFullyReceived = updatedItems.every(
      item => item.receivingStatus === ReceivingStatus.FULLY_RECEIVED
    );

    const anyReceived = updatedItems.some(
      item => item.receivingStatus !== ReceivingStatus.NOT_RECEIVED
    );

    let newStatus: RequisitionStatus;
    let completedAt: Date | null = null;

    if (allFullyReceived) {
      newStatus = RequisitionStatus.FULLY_RECEIVED;
      completedAt = new Date();
    } else if (anyReceived) {
      newStatus = RequisitionStatus.PARTIALLY_RECEIVED;
    } else {
      newStatus = RequisitionStatus.APPROVED;
    }

    // Update requisition status
    return this.prisma.requisition.update({
      where: { id: requisitionId },
      data: { 
        status: newStatus,
        completedAt: completedAt,
      },
      include: { 
        items: { 
          include: { 
            receivingLogs: { 
              include: { receivedBy: true },
              orderBy: { receivedAt: 'desc' }
            } 
          } 
        }, 
        employee: true, 
        company: true,
  
      },
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
      include: { 
        items: { include: { receivingLogs: true } }, 
        employee: true, 
        company: true 
      },
    });
  }

  // ───────────────────────────────────
  // DELETE
  // ───────────────────────────────────
  async delete(id: string) {
    return this.prisma.requisition.delete({ where: { id } });
  }

  // ───────────────────────────────────
  // FIND ALL (Admin)
  // ───────────────────────────────────
  async findAll(companyId: string) {
    return this.prisma.requisition.findMany({
      where: { companyId },
      include: { 
        items: { 
          include: { 
            receivingLogs: { 
              include: { receivedBy: true },
              orderBy: { receivedAt: 'desc' }
            } 
          } 
        }, 
        employee: true,
      
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────
  // FIND MY (Employee)
  // ───────────────────────────────────
  async findByEmployee(employeeId: string) {
    return this.prisma.requisition.findMany({
      where: { employeeId },
      include: { 
        items: { 
          include: { 
            receivingLogs: { 
              include: { receivedBy: true },
              orderBy: { receivedAt: 'desc' }
            } 
          } 
        }, 
        company: true,
        employee: true,
      
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────
  // FIND ONE
  // ───────────────────────────────────
  async findOne(id: string) {
    return this.prisma.requisition.findUnique({
      where: { id },
      include: { 
        items: { 
          include: { 
            receivingLogs: { 
              include: { receivedBy: true },
              orderBy: { receivedAt: 'desc' }
            } 
          } 
        }, 
        employee: true, 
        company: true,
       
      },
    });
  }

  // ───────────────────────────────────
  // GET RECEIVING SUMMARY
  // ───────────────────────────────────
  async getReceivingSummary(requisitionId: string) {
    const items = await this.prisma.requisitionItem.findMany({
      where: { requisitionId },
      include: {
        receivingLogs: {
          include: { receivedBy: true },
          orderBy: { receivedAt: 'desc' }
        }
      }
    });

    return items.map(item => ({
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      receivedQty: item.receivedQty,
      remainingQty: item.quantity - item.receivedQty,
      unit: item.unit,
      receivingStatus: item.receivingStatus,
   
    }));
  }
}