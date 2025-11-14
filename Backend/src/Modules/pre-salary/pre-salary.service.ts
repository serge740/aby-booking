import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Prisma, PreSalaryStatus } from 'generated/prisma';

@Injectable()
export class PreSalaryService {
  constructor(private prisma: PrismaService) {}

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

    if (!employee) throw new NotFoundException('Employee not found in this company');

    return this.prisma.preSalary.create({
      data,
    });
  }

  // ───────────────────────────────
  // GET ALL PRE-SALARIES
  // ───────────────────────────────
  async findAll(companyId: string) {
    return this.prisma.preSalary.findMany({
      where: { companyId },
      include: { employee: true },
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
  // APPROVE PRE-SALARY (Company only)
  // ───────────────────────────────
  async approvePreSalary(id: string, companyId: string) {
    const record = await this.findOne(id, companyId);

    if (record.status !== PreSalaryStatus.PENDING) {
      throw new BadRequestException('Only pending pre-salary can be approved');
    }

    return this.prisma.preSalary.update({
      where: { id },
      data: {
        status: PreSalaryStatus.APPROVED,
        approvedAt: new Date(),
        rejectedAt: null,
        reasonForRejection: null,
      },
    });
  }

  // ───────────────────────────────
  // REJECT PRE-SALARY (Company only)
  // ───────────────────────────────
  async rejectPreSalary(id: string, companyId: string, reason: string) {
    const record = await this.findOne(id, companyId);

    if (!reason) throw new BadRequestException('Reason is required');
    if (record.status !== PreSalaryStatus.PENDING) {
      throw new BadRequestException('Only pending pre-salary can be rejected');
    }

    return this.prisma.preSalary.update({
      where: { id },
      data: {
        status: PreSalaryStatus.REJECTED,
        rejectedAt: new Date(),
        reasonForRejection: reason,
      },
    });
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
