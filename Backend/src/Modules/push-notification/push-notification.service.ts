import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as webpush from 'web-push';
import { UserType } from 'generated/prisma';

@Injectable()
export class PushNotificationsService {
  constructor(private readonly prisma: PrismaService) {
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }

  // ───────────────────────────────
  // SUBSCRIBE USER (Employee/Company)
  // ───────────────────────────────
 async subscribe(userId: string, type: UserType, subscription: any, label?: string) {
  return this.prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
      type,
      label, // update label if provided
    },
    create: {
      userId,
      type,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      label,
    },
  });
}


  // ───────────────────────────────
  // UNSUBSCRIBE USER (remove one device)
  // ───────────────────────────────
 async unsubscribeDevice(userId: string, type: UserType, endpoint: string) {
  const sub = await this.prisma.pushSubscription.findUnique({
    where: { endpoint },
  });

  if (!sub || sub.userId !== userId || sub.type !== type) {
    throw new NotFoundException('Subscription not found for this device');
  }

  await this.prisma.pushSubscription.delete({
    where: { endpoint },
  });

  return {
    success: true,
    message: 'Device unsubscribed successfully',
  };
}

// ───────────────────────────────
// UNSUBSCRIBE ALL DEVICES FOR USER
// ───────────────────────────────
async unsubscribeAllDevices(userId: string, type: UserType) {
  const deleted = await this.prisma.pushSubscription.deleteMany({
    where: { userId, type },
  });

  return {
    success: true,
    message: `Unsubscribed ${deleted.count} devices for the user`,
  };
}

  // ───────────────────────────────
  // SEND TO A SINGLE USER (all devices)
  // ───────────────────────────────
  async sendToUser(userId: string, type: UserType, payload: any) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId, type },
    });

    if (!subscriptions.length) {
      throw new NotFoundException('User has no subscriptions');
    }

    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
      } catch (error: any) {
        console.error(`Failed to send to ${sub.endpoint}:`, error.message);
        if (error.statusCode === 410) {
          // remove expired subscription
          await this.unsubscribeDevice(sub.userId,sub.type,sub.endpoint);
        }
      }
    });

    await Promise.all(promises);
    return { success: true, sent: subscriptions.length };
  }

  // ───────────────────────────────
  // SEND TO ALL USERS OF A TYPE (Employee or Company)
  // ───────────────────────────────
  async sendToAll(type: UserType, payload: any) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { type },
    });

    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
      } catch (error: any) {
        console.error(`Failed to send to ${sub.endpoint}:`, error.message);
        if (error.statusCode === 410)   await this.unsubscribeDevice(sub.userId,sub.type,sub.endpoint);;
      }
    });

    await Promise.all(promises);
    return { success: true, sent: subscriptions.length };
  }

  // ───────────────────────────────
  // GET SUBSCRIPTIONS OF A USER
  // ───────────────────────────────
  async getSubscriptions(userId: string, type: UserType) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId, type },
    });

    return subscriptions;
  }

  // ───────────────────────────────
  // GET TOTAL SUBSCRIBED COUNT
  // ───────────────────────────────
  async getTotalSubscriptions(type?: UserType) {
    const count = await this.prisma.pushSubscription.count({
      where: type ? { type } : {},
    });

    return count;
  }
}
