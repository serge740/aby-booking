import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { RiskSeverity, RiskStatus } from 'generated/prisma';
import { CompanyNotificationService } from '../company-notification/company-notification.service';

@Injectable()
export class RiskReportService {
  constructor(
    private prisma: PrismaService,
    private notificationService: CompanyNotificationService,
  ) {}

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

    const report = await this.prisma.employeeRiskReport.create({
      data: {
        employeeId: data.employeeId,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        attachments: data.attachments || [],
        status: RiskStatus.PENDING,
      },
      include: { employee: true },
    });

    // 🔥 Notify company of new risk report
    await this.notificationService.createNotification({
      title: `New Risk Report Submitted`,
      message: `${report.employee.first_name} ${report.employee.last_name} submitted a risk report: "${report.title}".`,
      recipients: [{ id: data.companyId, type: 'COMPANY', read: false }],
      senderId: data.employeeId,
      senderType: 'EMPLOYEE',
      link: `/company/dashboard/risk-reports/${report.id}`,
    });

    return report;
  }

  // ───────────────────────────────
  // FIND ALL REPORTS
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
  // FIND ONE REPORT
  // ───────────────────────────────
  async findOne(id: string, companyId: string) {
    const report = await this.prisma.employeeRiskReport.findFirst({
      where: { id, companyId },
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
  // UPDATE RISK REPORT (only pending)
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
  // RESOLVE REPORT
  // ───────────────────────────────
  async resolveReport(id: string, companyId: string) {
    const report = await this.findOne(id, companyId);

    if (report.status !== RiskStatus.PENDING) {
      throw new BadRequestException('Only pending reports can be resolved');
    }

    const updated = await this.prisma.employeeRiskReport.update({
      where: { id },
      data: {
        status: RiskStatus.RESOLVED,
        resolvedAt: new Date(),
      },
      include: { employee: true },
    });

    // 🔥 Notify employee
    await this.notificationService.createNotification({
      title: `Your risk report has been resolved`,
      message: `Your report "${updated.title}" has been marked as resolved.`,
      recipients: [{ id: updated.employeeId, type: 'EMPLOYEE', read: false }],
      senderId: companyId,
      senderType: 'COMPANY',
      link: `/employee/dashboard/risk-reports/${updated.id}`,
    });

    return updated;
  }

  // ───────────────────────────────
  // REJECT REPORT
  // ───────────────────────────────
  async rejectReport(id: string, companyId: string, reason: string) {
    const report = await this.findOne(id, companyId);

    if (!reason) throw new BadRequestException('Rejection reason required');
    if (report.status !== RiskStatus.PENDING) {
      throw new BadRequestException('Only pending reports can be rejected');
    }

    const updated = await this.prisma.employeeRiskReport.update({
      where: { id },
      data: {
        status: RiskStatus.REJECTED,
        reason,
        resolvedAt: new Date(),
      },
      include: { employee: true },
    });

    // 🔥 Notify employee
    await this.notificationService.createNotification({
      title: `Your risk report was rejected`,
      message: `Your report "${updated.title}" was rejected. Reason: ${reason}`,
      recipients: [{ id: updated.employeeId, type: 'EMPLOYEE', read: false }],
      senderId: companyId,
      senderType: 'COMPANY',
      link: `/employee/dashboard/risk-reports/${updated.id}`,
    });

    return updated;
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
