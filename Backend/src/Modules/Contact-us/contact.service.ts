// src/contact/contact.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async processContact(data: any) {
    const { firstName,lastName, email, phone, message } = data;

    if (!firstName || !lastName || !email || !phone  || !message) {
      throw new BadRequestException('All fields are required');
    }

    await this.prisma.contactMessage.create({
      data: { firstName, lastName , email, phone, message },
    });

    return { success: true, message: 'Thank you for contacting us!' };
  }

  async getAllMessages() {
    return await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMessage(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Contact message not found');
    }

    await this.prisma.contactMessage.delete({ where: { id } });
    return { success: true, message: 'Contact message deleted successfully' };
  }
}
