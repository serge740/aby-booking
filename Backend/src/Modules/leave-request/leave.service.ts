import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Prisma, LeaveStatus, LeaveType } from 'generated/prisma';
import { CompanyNotificationService } from '../company-notification/company-notification.service';
import { PushNotificationsService } from '../push-notification/push-notification.service';

@Injectable()
export class LeaveService {
    constructor(
        private readonly prisma: PrismaService,
         private readonly pushNotificationsService: PushNotificationsService, // <-- inject push service
        private readonly notificationService: CompanyNotificationService, // inject notification service
    ) { }

    // ───────────────────────────────
    // CREATE LEAVE REQUEST
    // ───────────────────────────────
    async createLeaveRequest(data: {
        employeeId: string;
        companyId: string;
        type: string;
        startDate: Date;
        endDate: Date;
        reasonForRequest?: string;
        attachments?: any[];
    }) {
        if (data.endDate < data.startDate) throw new BadRequestException('End date cannot be before start');
        console.log(data);

        const leave = await this.prisma.leave.create({
            data: {
                employeeId: data.employeeId,
                companyId: data.companyId,
                type: data.type as any,
                startDate: data.startDate,
                endDate: data.endDate,
                reasonForRequest: data.reasonForRequest,
                attachments: data.attachments || [],
                status: LeaveStatus.PENDING,
            },
            include: {
                company: true,
                employee: true,
            }
        });

        // 🔥 Send notification to company about new leave request
        await this.notificationService.createNotification({
            title: `New leave request from employee`,
            message: `Employee ${leave.employee.first_name || ''} ${leave.employee.last_name || ''} has requested leave from ${data.startDate.toDateString()} to ${data.endDate.toDateString()}`,
            recipients: [{ id: data.companyId, type: 'COMPANY', read: false }],
            senderId: data.employeeId,
            senderType: 'EMPLOYEE',
            link: `/company/dashboard/leave-request/${leave.id}`
        });

        // Send push notification to the company's devices
await this.pushNotificationsService.sendToUser(data.companyId, 'COMPANY', {
  title: `New leave request from employee`,
  message: `Employee ${leave.employee.first_name || ''} ${leave.employee.last_name || ''} has requested leave from ${data.startDate.toDateString()} to ${data.endDate.toDateString()}`,
  link: `/company/dashboard/leave-request/${leave.id}`,
});


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

        if (!leave) throw new BadRequestException('Cant find the leave');

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
            include: {
                company: true,
                employee: true,
            }
        });
    }

    // ───────────────────────────────
    // APPROVE LEAVE
    // ───────────────────────────────
    async approveLeave(leaveId: string, companyId: string) {
        const leave = await this.prisma.leave.findFirst({ where: { id: leaveId, companyId } });
        if (!leave) throw new NotFoundException('Leave not found');
        if (leave.status !== LeaveStatus.PENDING) throw new ForbiddenException('Only pending leaves can be approved');

        const updated = await this.prisma.leave.update({
            where: { id: leaveId },
            data: { status: LeaveStatus.APPROVED, approvedAt: new Date() },
            include: {
                company: true,
                employee: true,
            }
        });

        // 🔥 Notify employee about approval
        await this.notificationService.createNotification({
            title: `Your leave has been approved`,
            message: `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been approved.`,
            recipients: [{ id: leave.employeeId, type: 'EMPLOYEE', read: false }],
            senderId: companyId,
            senderType: 'COMPANY',
            link: `/employee/dashboard/leave-request/${leave.id}`
        });

        // Notify employee about approval
await this.pushNotificationsService.sendToUser(leave.employeeId, 'EMPLOYEE', {
  title: `Your leave has been approved`,
  message: `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been approved.`,
  link: `/employee/dashboard/leave-request/${leave.id}`,
});


        return updated;
    }



    // ───────────────────────────────
    // REJECT LEAVE
    // ───────────────────────────────
    async rejectLeave(leaveId: string, companyId: string, reason: string) {
        const leave = await this.prisma.leave.findFirst({ where: { id: leaveId, companyId } });
        if (!leave) throw new NotFoundException('Leave not found');
        if (!reason) throw new BadRequestException('Rejection reason required');
        if (leave.status !== LeaveStatus.PENDING) throw new ForbiddenException('Only pending leaves can be rejected');

        const updated = await this.prisma.leave.update({
            where: { id: leaveId },
            data: { status: LeaveStatus.REJECTED, rejectedAt: new Date(), reasonForRejection: reason },
            include: {
                company: true,
                employee: true,
            }
        });

        // 🔥 Notify employee about rejection
        await this.notificationService.createNotification({
            title: `Your leave has been rejected`,
            message: `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been rejected. Reason: ${reason}`,
            recipients: [{ id: leave.employeeId, type: 'EMPLOYEE', read: false }],
            senderId: companyId,
            senderType: 'COMPANY',
            link: `/employee/dashboard/leave-request/${leave.id}`
        });

        // Notify employee about rejection
await this.pushNotificationsService.sendToUser(leave.employeeId, 'EMPLOYEE', {
  title: `Your leave has been rejected`,
  message: `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been rejected. Reason: ${reason}`,
  link: `/employee/dashboard/leave-request/${leave.id}`,
});


        return updated;
    }

    // ───────────────────────────────
    // DELETE LEAVE
    // ───────────────────────────────
    async deleteLeave(leaveId: string, ownerId: string) {
        const leave = await this.prisma.leave.findFirst({ where: { id: leaveId } });
        if (!leave) throw new NotFoundException('Leave not found');

        return this.prisma.leave.delete({ where: { id: leaveId } });
    }

    // ───────────────────────────────
    // FIND LEAVES
    // ───────────────────────────────
    async findAll(companyId: string) {
        return this.prisma.leave.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                company: true,
                employee: true,
            }
        });
    }

    async findAllByEmployee(employeeId: string) {
        return this.prisma.leave.findMany({
            where: { employeeId },
            orderBy: { createdAt: 'desc' },
            include: {
                company: true,
                employee: true,
            },
        });
    }

    async findOne(id: string, companyId: string) {
        return this.prisma.leave.findFirst({
            where: { id, companyId },
            include: {
                company: true,
                employee: true,
            }
        });
    }

    async findOneByEmployee(id: string, employeeId: string) {
        return this.prisma.leave.findFirst({
            where: { id, employeeId },
            include: {
                company: true,
                employee: true,
            },
        });
    }
}
