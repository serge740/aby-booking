import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { RiskSeverity, RiskStatus } from 'generated/prisma';

@Injectable()
export class RiskReportService {
  constructor(private prisma: PrismaService) {}

  // ───────────────────────────────
  // CREATE RISK REPORT
  // ───────────────────────────────
  async createRiskReport(data: {
    employeeId: string;
    companyId: string;
    title: string;
    description: string;
    severity: RiskSeverity;
    attachments?: any;
  }) {
    const isEmployeeBelongs = await this.prisma.employee.findFirst({
      where: { id: data.employeeId, companyId: data.companyId },
    });

    if (!isEmployeeBelongs) {
      throw new NotFoundException('Employee does not belong to this company');
    }

    return this.prisma.employeeRiskReport.create({
      data: {
        employeeId: data.employeeId,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        attachments: data.attachments || [],
      },
    });
  }

  // ───────────────────────────────
  // FIND ALL REPORTS (company or employee)
  // ───────────────────────────────
  async findAllByCompany(companyId: string) {
    return this.prisma.employeeRiskReport.findMany({
      where: { companyId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByEmployee(employeeId: string) {
    return this.prisma.employeeRiskReport.findMany({
      where: { employeeId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────
  // FIND SINGLE REPORT
  // ───────────────────────────────
  async findOne(id: string, ownerId: string) {
    const report = await this.prisma.employeeRiskReport.findFirst({
      where: { id, companyId: ownerId },
      include: { employee: true },
    });

    if (!report) throw new NotFoundException('Risk report not found');
    return report;
  }

  async findOneByEmployee(id: string, employeeId: string) {
    const report = await this.prisma.employeeRiskReport.findFirst({
      where: { id, employeeId },
      include: { employee: true },
    });

    if (!report) throw new NotFoundException('Risk report not found');
    return report;
  }

  // ───────────────────────────────
  // UPDATE RISK REPORT (Only pending)
  // ───────────────────────────────
  async updateRiskReport(
    id: string,
    ownerId: string,
    data: {
      title?: string;
      description?: string;
      severity?: RiskSeverity;
      attachments?: any;
    },
  ) {
    const report =
      (await this.findOne(id, ownerId).catch(() =>
        this.findOneByEmployee(id, ownerId),
      )) || null;

    if (!report) throw new NotFoundException('Risk report not found');

    if (report.status !== RiskStatus.PENDING) {
      throw new ForbiddenException('Only pending reports can be updated');
    }

    return this.prisma.employeeRiskReport.update({
      where: { id },
      data,
    });
  }

  // ───────────────────────────────
  // RESOLVE REPORT (Company only)
  // ───────────────────────────────
  async resolveReport(id: string, companyId: string) {
    const report = await this.findOne(id, companyId);

    if (report.status !== RiskStatus.PENDING) {
      throw new BadRequestException('Only pending reports can be resolved');
    }

    return this.prisma.employeeRiskReport.update({
      where: { id },
      data: {
        status: RiskStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });
  }

  // ───────────────────────────────
  // REJECT REPORT (Company only)
  // ───────────────────────────────
  async rejectReport(id: string, companyId: string, reason: string) {
    const report = await this.findOne(id, companyId);

    if (!reason) throw new BadRequestException('Rejection reason required');

    if (report.status !== RiskStatus.PENDING) {
      throw new BadRequestException('Only pending reports can be rejected');
    }

    return this.prisma.employeeRiskReport.update({
      where: { id },
      data: {
        status: RiskStatus.REJECTED,
        reason,
        resolvedAt: new Date(),
      },
    });
  }

  // ───────────────────────────────
  // DELETE REPORT
  // ───────────────────────────────
  async deleteReport(id: string, ownerId: string) {
    const report =
      (await this.findOne(id, ownerId).catch(() =>
        this.findOneByEmployee(id, ownerId),
      )) || null;

    if (!report) throw new NotFoundException('Risk report not found');

    return this.prisma.employeeRiskReport.delete({ where: { id } });
  }
}
