import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { LeaveStatus, LeaveType, Prisma } from 'generated/prisma';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  // ───────────────────────────────────────────────
  // CREATE LEAVE REQUEST (Company or Employee)
  // ───────────────────────────────────────────────
  async createLeaveRequest(data: {
    employeeId: string;
    companyId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    reasonForRequest?: string;
    attachments?: any[];
  }) {
    if (data.endDate < data.startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: data.employeeId, companyId: data.companyId },
    });

    if (!employee)
      throw new NotFoundException('Employee not found in this company');

    const overlapping = await this.prisma.leave.findFirst({
      where: {
        employeeId: data.employeeId,
        status: LeaveStatus.APPROVED,
        AND: [
          { startDate: { lte: data.endDate } },
          { endDate: { gte: data.startDate } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException('Employee already has approved leave in this period');
    }

    return this.prisma.leave.create({
      data: {
        ...data,
        attachments: data.attachments || [],
      },
    });
  }

  // ───────────────────────────────────────────────
  // GET ALL LEAVES (Company)
  // ───────────────────────────────────────────────
  async findAll(companyId: string) {
    return this.prisma.leave.findMany({
      where: { companyId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────
  // GET ALL LEAVES (Employee)
  // ───────────────────────────────────────────────
  async findAllByEmployee(employeeId: string) {
    return this.prisma.leave.findMany({
      where: { employeeId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────
  // GET SINGLE LEAVE (Company)
  // ───────────────────────────────────────────────
  async findOne(id: string, companyId: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id, companyId },
      include: { employee: true },
    });

    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }

  // ───────────────────────────────────────────────
  // GET SINGLE LEAVE (Employee)
  // ───────────────────────────────────────────────
  async findOneByEmployee(id: string, employeeId: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id, employeeId },
      include: { employee: true },
    });

    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }

  // ───────────────────────────────────────────────
  // UPDATE LEAVE REQUEST (Only pending)
  // ───────────────────────────────────────────────
  async updateLeave(
    id: string,
    ownerId: string,
    data: {
      type?: LeaveType;
      startDate?: Date;
      endDate?: Date;
      reasonForRequest?: string;
      attachments?: any[];
    },
  ) {
    const leave = await this.findOne(id, ownerId).catch(() =>
      this.findOneByEmployee(id, ownerId),
    );

    if (leave.status !== LeaveStatus.PENDING) {
      throw new ForbiddenException('Only pending leave can be updated');
    }

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    return this.prisma.leave.update({
      where: { id },
      data: {
        ...data,
        attachments: (data.attachments ?? leave.attachments) as Prisma.InputJsonValue,
      },
    });
  }

  // ───────────────────────────────────────────────
  // APPROVE LEAVE (Company only)
  // ───────────────────────────────────────────────
  async approveLeave(id: string, companyId: string) {
    const leave = await this.findOne(id, companyId);

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave can be approved');
    }

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: LeaveStatus.APPROVED,
        approvedAt: new Date(),
        rejectedAt: null,
        reasonForRejection: null,
      },
    });
  }

  // ───────────────────────────────────────────────
  // REJECT LEAVE (Company only)
  // ───────────────────────────────────────────────
  async rejectLeave(id: string, companyId: string, reasonForRejection: string) {
    const leave = await this.findOne(id, companyId);

    if (!reasonForRejection) {
      throw new BadRequestException('Rejection reason is required');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave can be rejected');
    }

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: LeaveStatus.REJECTED,
        rejectedAt: new Date(),
        reasonForRejection,
      },
    });
  }

  // ───────────────────────────────────────────────
  // DELETE LEAVE (Company or Employee)
  // ───────────────────────────────────────────────
  async deleteLeave(id: string, ownerId: string) {
    const leave =
      (await this.findOne(id, ownerId).catch(() => this.findOneByEmployee(id, ownerId))) ||
      null;

    if (!leave) throw new NotFoundException('Leave request not found');

    return this.prisma.leave.delete({ where: { id } });
  }
}
