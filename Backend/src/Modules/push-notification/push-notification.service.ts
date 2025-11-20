import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as webpush from 'web-push';
import { UserType } from 'generated/prisma';

type WebPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

@Injectable()
export class PushNotificationsService {
  constructor(private readonly prisma: PrismaService) {
    // set your VAPID details via env vars
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY ?? '',
      process.env.VAPID_PRIVATE_KEY ?? '',
    );
  }

  // ───────────────────────────────
  // SUBSCRIBE USER (Employee/Company)
  // ───────────────────────────────
  async subscribe(
    userId: string,
    type: UserType,
    subscription: WebPushSubscription,
    label?: string,
  ) {
    // find existing by endpoint (endpoint is unique in schema but safe to findFirst)
    const existing = await this.prisma.pushSubscription.findFirst({
      where: { endpoint: subscription.endpoint },
    });

    if (existing) {
      // update by id (update/delete require a unique where - use id)
      return await this.prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
          userId,
          type,
          label,
        },
      });
    }

    // create new subscription
    return await this.prisma.pushSubscription.create({
      data: {
        userId,
        type,
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        label,
      },
    });
  }

  // ───────────────────────────────
  // UNSUBSCRIBE USER (remove one device)
  // ───────────────────────────────
  async unsubscribeDevice(userId: string, type: UserType, endpoint: string) {
    const sub = await this.prisma.pushSubscription.findFirst({
      where: { endpoint },
    });

    if (!sub || sub.userId !== userId || sub.type !== type) {
      throw new NotFoundException('Subscription not found for this device');
    }

    // delete by unique id
    await this.prisma.pushSubscription.delete({
      where: { id: sub.id },
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
      return { success: false, message: 'No subscriptions found for user' };
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(payload),
          );
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error(`Failed to send to ${sub.endpoint}:`, error);

          // if subscription is gone (410) remove by id
          if (error?.statusCode === 410) {
            try {
              await this.prisma.pushSubscription.delete({
                where: { id: sub.id },
              });
            } catch (deleteError) {
              console.error(
                `Failed to delete expired subscription (id=${sub.id}):`,
                deleteError,
              );
            }
          }

          // rethrow so Promise.allSettled captures rejection
          throw error;
        }
      }),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    return { success: true, sent: successful, total: subscriptions.length };
  }

  // ───────────────────────────────
  // SEND TO ALL USERS OF A TYPE (Employee or Company)
  // ───────────────────────────────
  async sendToAll(type: UserType, payload: any) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { type },
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(payload),
          );
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error(`Failed to send to ${sub.endpoint}:`, error?.message);

          if (error?.statusCode === 410) {
            try {
              await this.prisma.pushSubscription.delete({
                where: { id: sub.id },
              });
            } catch (deleteError) {
              console.error(
                `Failed to delete expired subscription (id=${sub.id}):`,
                deleteError,
              );
            }
          }

          throw error;
        }
      }),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    return { success: true, sent: successful, total: subscriptions.length };
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
