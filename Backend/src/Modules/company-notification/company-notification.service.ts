import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { GlobalSocketGateway } from 'src/Global/socket/socket.gateway';

export type Recipient = {
  id: string;
  type: 'COMPANY' | 'EMPLOYEE';
  read: boolean;
};

@Injectable()
export class CompanyNotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socket: GlobalSocketGateway, // <<–– INJECT SOCKET
  ) {}

  // ────────────────────────────────
  // CREATE NOTIFICATION
  // ────────────────────────────────
  async createNotification(data: {
    recipients: Recipient[];
    senderId?: string;
    senderType?: 'COMPANY' | 'EMPLOYEE';
    title: string;
    message: string;
    link?: string;
  }) {
    if (!data.recipients || !data.recipients.length) {
      throw new BadRequestException('At least one recipient is required');
    }

    const notification = await this.prisma.companyNotification.create({
      data: {
        recipients: data.recipients as any,
        senderId: data.senderId,
        senderType: data.senderType,
        title: data.title,
        message: data.message,
        link: data.link,
      },
    });

    // 🔥 EMIT REAL-TIME NOTIFICATION TO RECIPIENTS
    this.socket.emitToRecipients(
      data.recipients,
      'new-notification',
      notification,
    );

    console.log('new message ');
    

    return notification;
  }

  // ────────────────────────────────
  // GET NOTIFICATIONS FOR A SPECIFIC RECIPIENT
  // ────────────────────────────────
  async getNotificationsForRecipient(recipientId: string, recipientType: 'COMPANY' | 'EMPLOYEE') {
    const notifications = await this.prisma.companyNotification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return notifications.filter((notif) =>
      (notif.recipients as Recipient[]).some(
        (r) => r.id === recipientId && r.type === recipientType,
      ),
    );
  }

  // ────────────────────────────────
  // MARK AS READ
  // ────────────────────────────────
  async markAsRead(notificationId: string, recipientId: string) {
    const notification = await this.prisma.companyNotification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    const recipients = (notification.recipients as Recipient[]).map((r) => {
      if (r.id === recipientId) return { ...r, read: true };
      return r;
    });

    const updated = await this.prisma.companyNotification.update({
      where: { id: notificationId },
      data: { recipients: recipients as any },
    });

    const recipient = (notification.recipients as Recipient[]).find((r)=>  r.id === recipientId )
    if(recipient){

        // 🔥 EMIT READ STATUS UPDATE
        this.socket.emitToRecipients(
            [{...recipient}],
            'notification-read',
            { notificationId, recipientId },
        );
    }

    return updated;
  }
}
