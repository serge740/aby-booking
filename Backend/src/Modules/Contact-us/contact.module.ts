// src/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaService } from '../../Prisma/prisma.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
})
export class ContactModule {}
