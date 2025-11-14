import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyNotificationService, Recipient } from './company-notification.service';
import { DualAuthGuard, RequestWithCompanyEmployee } from 'src/Guards/dual-auth.guard';

@Controller('notifications')
@UseGuards(DualAuthGuard)
export class CompanyNotificationController {
  constructor(private readonly notificationService: CompanyNotificationService) {}

  // ────────────────────────────────
  // CREATE NOTIFICATION
  // ────────────────────────────────
  @Post()
  async createNotification(
    @Req() req: RequestWithCompanyEmployee,
    @Body() body: {
      recipients: Recipient[];
      title: string;
      message: string;
      link?: string;
    }
  ) {

    return this.notificationService.createNotification({
      ...body,
      senderId: req.company?.id || req.employee?.id,
      senderType: req.company ? 'COMPANY' : 'EMPLOYEE',
    });
  }

  // ────────────────────────────────
  // GET NOTIFICATIONS FOR LOGGED IN USER
  // ────────────────────────────────
  @Get()
  async getNotifications(@Req() req: RequestWithCompanyEmployee) {
    const id = req.company?.id || req.employee?.id;
    const type = req.company ? 'COMPANY' : 'EMPLOYEE';

    console.log(`${type} : `,id);
    

    return this.notificationService.getNotificationsForRecipient(id, type);
  }

  // ────────────────────────────────
  // MARK AS READ
  // ────────────────────────────────
  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: RequestWithCompanyEmployee) {
    const recipientId = req.company?.id || req.employee?.id;
    return this.notificationService.markAsRead(id, recipientId);
  }
}
