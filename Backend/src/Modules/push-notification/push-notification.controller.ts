import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { PushNotificationsService } from './push-notification.service';
import { UserType } from 'generated/prisma';

@Controller('push-notification')
export class PushNotificationsController {
  constructor(private readonly notificationsService: PushNotificationsService) {}

  // ───────────────────────────────
  // SUBSCRIBE USER
  // ───────────────────────────────
@Post('subscribe')
async subscribe(
  @Body('userId') userId: string,
  @Body('type') type: UserType,
  @Body('subscription') subscription: any,
  @Body('label') label?: string,  // optional label
) {
    console.log('SHOYS DKDC :',userId, type, subscription, label);
    
  return this.notificationsService.subscribe(userId, type, subscription, label);
}


  // ───────────────────────────────
  // UNSUBSCRIBE SINGLE DEVICE
  // ───────────────────────────────
  @Delete('unsubscribe/device')
  async unsubscribeDevice(
    @Body('userId') userId: string,
    @Body('type') type: UserType,
    @Body('endpoint') endpoint: string,
  ) {
    return this.notificationsService.unsubscribeDevice(userId, type, endpoint);
  }

  // ───────────────────────────────
  // UNSUBSCRIBE ALL DEVICES
  // ───────────────────────────────
  @Delete('unsubscribe/all')
  async unsubscribeAllDevices(
    @Body('userId') userId: string,
    @Body('type') type: UserType,
  ) {
    return this.notificationsService.unsubscribeAllDevices(userId, type);
  }

  // ───────────────────────────────
  // SEND TO SINGLE USER
  // ───────────────────────────────
  @Post('send/user')
  async sendToUser(
    @Body('userId') userId: string,
    @Body('type') type: UserType,
    @Body('payload') payload: any,
  ) {
    return this.notificationsService.sendToUser(userId, type, payload);
  }

  // ───────────────────────────────
  // SEND TO ALL USERS OF TYPE
  // ───────────────────────────────
  @Post('send/all')
  async sendToAll(
    @Body('type') type: UserType,
    @Body('payload') payload: any,
  ) {
    return this.notificationsService.sendToAll(type, payload);
  }

  // ───────────────────────────────
  // GET USER SUBSCRIPTIONS
  // ───────────────────────────────
  @Get('subscriptions/:userId/:type')
  async getSubscriptions(
    @Param('userId') userId: string,
    @Param('type') type: UserType,
  ) {
    return this.notificationsService.getSubscriptions(userId, type);
  }

  // ───────────────────────────────
  // GET TOTAL SUBSCRIPTIONS COUNT
  // ───────────────────────────────
  @Get('count/:type')
  async getTotalSubscriptions(@Param('type') type?: UserType) {
    return this.notificationsService.getTotalSubscriptions(type);
  }
}
