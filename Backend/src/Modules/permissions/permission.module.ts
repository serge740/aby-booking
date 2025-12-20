import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PermissionGateway } from './permission.gateway';
import { CompanyNotificationService } from '../company-notification/company-notification.service';
import { PushNotificationsService } from '../push-notification/push-notification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [PermissionController],

    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'yourSecretKey',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [
        PrismaService,
        CompanyNotificationService,
        PushNotificationsService,
        PermissionService,
        PrismaService,
        PermissionGateway],
})
export class PermissionModule { }
