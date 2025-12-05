import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { GlobalSocketGateway } from 'src/Global/socket/socket.gateway';
import { PushNotificationsService } from '../push-notification/push-notification.service';
import { RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';

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
       private readonly pushNotificationsService: PushNotificationsService,
  ) {}


  async findCompany(senderId:string, senderType:'COMPANY' | 'EMPLOYEE'){
    if(senderType === 'COMPANY'){
        const company = await this.prisma.company.findUnique({where:{id: senderId}});
        return company;
    }

    if(senderType === 'EMPLOYEE'){  
        const employee = await this.prisma.employee.findUnique({where:{id: senderId}, include:{company:true}});
        return employee?.company;
    }


  }

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
},
req?:RequestWithCompanyEmployee
) {
  if (!data.recipients || !data.recipients.length) {
    throw new BadRequestException('At least one recipient is required');
  }

  // 1️⃣ SAVE NOTIFICATION
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

  const senderCompany = await this.findCompany(data.senderId!, data.senderType!);
const logoPath = senderCompany?.logo || "";
const normalizedPath = logoPath.replace(/\\/g, "/"); 

let origin:any = null;

if (req) {
  origin = `${req.protocol}://${req.get("host")}`;
} else {
  origin = process.env.APP_URL; // fallback when no req
}

const icon = senderCompany?.logo
  ? `${origin}${normalizedPath}`
  : null;


  console.log('url icons => :',icon);
  


  

  // 2️⃣ SEND PUSH NOTIFICATIONS TO ALL RECIPIENTS (async/await only)
  const pushPromises = data.recipients.map(async (recipient) => {
    try {
      await this.pushNotificationsService.sendToUser(
        recipient.id,
        recipient.type,
        {
          title: data.title,
          message: data.message,
          url: data.link,
          tag: notification.id,
          icon : senderCompany?.logo ? icon : null,
          data:{
             url: data.link,
             notificationId: notification.id
          }
        },
      );
    } catch (error) {
      console.error(
        `❌ Failed to send push to recipient ${recipient.id}:`,
        error,
      );
    }
  });

  await Promise.all(pushPromises);

  // 3️⃣ SOCKET EMIT
  this.socket.emitToRecipients(
    data.recipients,
    'new-notification',
    notification,
  );

  console.log('new message');

  return notification;
}


  // ────────────────────────────────
  // GET NOTIFICATIONS FOR A SPECIFIC RECIPIENT
  // ────────────────────────────────
async getNotificationsForRecipient(
  recipientId: string,
  recipientType: 'COMPANY' | 'EMPLOYEE',
  page: number = 1,
  limit: number = 10,
  searchQuery?: string,
) {
  const skip = (page - 1) * limit;

  let notifications = await this.prisma.companyNotification.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Filter by recipient
  notifications = notifications.filter((notif) =>
    (notif.recipients as Recipient[]).some(
      (r) => r.id === recipientId && r.type === recipientType,
    ),
  );

  // Apply search filter
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    notifications = notifications.filter(
      (notif) =>
        notif.title.toLowerCase().includes(query) ||
        notif.message.toLowerCase().includes(query),
    );
  }

  // Total count before pagination
  const total = notifications.length;

  // Paginate
  const paginated = notifications.slice(skip, skip + limit);

  return {
    data: paginated,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
