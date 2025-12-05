import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Prisma, PreSalaryStatus } from 'generated/prisma';
import { CompanyNotificationService } from '../company-notification/company-notification.service';

@Injectable()
export class PreSalaryService {
  constructor(
    private prisma: PrismaService,
    private notificationService: CompanyNotificationService, // ✅ NOTIFICATION SERVICE
  ) {}

  // ───────────────────────────────
  // CREATE PRE-SALARY REQUEST
  // ───────────────────────────────
  async createPreSalary(data: {
    employeeId: string;
    companyId: string;
    amount: number;
    currency?: string;
    periodStart: Date;
    periodEnd: Date;
    reason?: string;
  }) {
    if (data.periodEnd < data.periodStart) {
      throw new BadRequestException('Period end cannot be before start');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: data.employeeId, companyId: data.companyId },
    });

    if (!employee)
      throw new NotFoundException('Employee not found in this company');

    const record = await this.prisma.preSalary.create({
      data,
      include: { employee: true,company:true },
    });

    // 🔥 Notify company about new pre-salary request
    await this.notificationService.createNotification({
      title: `New Pre-Salary Request`,
      message: `Employee ${record.employee.first_name || ''} ${record.employee.last_name || ''} has requested a pre-salary of ${data.amount} ${data.currency || ''}.`,
      recipients: [{ id: data.companyId, type: 'COMPANY', read: false }],
      senderId: data.employeeId,
      senderType: 'EMPLOYEE',
      link: `/company/dashboard/pre-salary/${record.id}`,
    });

    return record;
  }

  // ───────────────────────────────
  // GET ALL PRE-SALARIES
  // ───────────────────────────────
  async findAll(companyId: string) {
    return this.prisma.preSalary.findMany({
      where: { companyId },
      include: { employee: true,company:true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByEmployee(employeeId: string) {
    return this.prisma.preSalary.findMany({
      where: { employeeId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────
  // GET SINGLE PRE-SALARY
  // ───────────────────────────────
  async findOne(id: string, companyId: string) {
    const record = await this.prisma.preSalary.findFirst({
      where: { id, companyId },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('Pre-salary record not found');
    return record;
  }

  async findOneByEmployee(id: string, employeeId: string) {
    const record = await this.prisma.preSalary.findFirst({
      where: { id, employeeId },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('Pre-salary record not found');
    return record;
  }

  // ───────────────────────────────
  // UPDATE PRE-SALARY (Only pending)
  // ───────────────────────────────
  async updatePreSalary(
    id: string,
    ownerId: string,
    data: {
      amount?: number;
      currency?: string;
      periodStart?: Date;
      periodEnd?: Date;
      reason?: string;
    },
  ) {
    const record = await this.findOne(id, ownerId).catch(() =>
      this.findOneByEmployee(id, ownerId),
    );

    if (record.status !== PreSalaryStatus.PENDING) {
      throw new ForbiddenException('Only pending pre-salary can be updated');
    }

    if (data.periodStart && data.periodEnd && data.periodEnd < data.periodStart) {
      throw new BadRequestException('Period end cannot be before start');
    }

    return this.prisma.preSalary.update({
      where: { id },
      data,
    });
  }

  // ───────────────────────────────
  // APPROVE PRE-SALARY
  // ───────────────────────────────
  async approvePreSalary(id: string, companyId: string,reason:string) {
    const record = await this.findOne(id, companyId);

    if (record.status !== PreSalaryStatus.PENDING) {
      throw new BadRequestException('Only pending pre-salary can be approved');
    }

    const updated = await this.prisma.preSalary.update({
      where: { id },
      data: {
        status: PreSalaryStatus.APPROVED,
        reason: reason,
        approvedAt: new Date(),
        rejectedAt: null,
        reasonForRejection: null,
      },
      include: { employee: true },
    });

    // 🔥 Notify employee
    await this.notificationService.createNotification({
      title: `Your Pre-Salary Request Approved`,
      message: `Your request for ${record.amount} ${record.currency || ''} has been approved.`,
      recipients: [{ id: record.employeeId, type: 'EMPLOYEE', read: false }],
      senderId: companyId,
      senderType: 'COMPANY',
      link: `/employee/dashboard/pre-salary/${record.id}`,
    });

    return updated;
  }

  // ───────────────────────────────
  // REJECT PRE-SALARY
  // ───────────────────────────────
  async rejectPreSalary(id: string, companyId: string, reason: string) {
    const record = await this.findOne(id, companyId);

    if (!reason) throw new BadRequestException('Reason is required');
    if (record.status !== PreSalaryStatus.PENDING) {
      throw new ForbiddenException('Only pending pre-salary can be rejected');
    }

    const updated = await this.prisma.preSalary.update({
      where: { id },
      data: {
        status: PreSalaryStatus.REJECTED,
        rejectedAt: new Date(),
        reasonForRejection: reason,
      },
      include: { employee: true },
    });

    // 🔥 Notify employee
    await this.notificationService.createNotification({
      title: `Your Pre-Salary Request Rejected`,
      message: `Your request for ${record.amount} ${record.currency || ''} has been rejected. Reason: ${reason}`,
      recipients: [{ id: record.employeeId, type: 'EMPLOYEE', read: false }],
      senderId: companyId,
      senderType: 'COMPANY',
      link: `/employee/dashboard/pre-salary/${record.id}`,
    });

    return updated;
  }

  // ───────────────────────────────
  // DELETE PRE-SALARY
  // ───────────────────────────────
  async deletePreSalary(id: string, ownerId: string) {
    const record =
      (await this.findOne(id, ownerId).catch(() => this.findOneByEmployee(id, ownerId))) ||
      null;
    if (!record) throw new NotFoundException('Pre-salary record not found');

    return this.prisma.preSalary.delete({ where: { id } });
  }
}
