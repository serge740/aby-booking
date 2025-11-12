import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { EmailService } from 'src/Global/email/email.service';
import { ClientAuthModule } from './auth/client-auth.module';

@Module({
    imports:[ClientAuthModule],
  controllers: [ClientController],
  providers: [ClientService, PrismaService, EmailService],
  exports: [ClientService],
})
export class ClientModule {}
