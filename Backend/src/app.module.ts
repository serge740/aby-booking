// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';

import { TestimonialModule } from './Modules/testmonial-management/testmonial.module';
import { BlogModule } from './Modules/Blog-management/blog.module';
import { ContactModule } from './Modules/Contact-us/contact.module';
import { OrderModule } from './Modules/order-management/order.module';

import { EmailModule } from './Global/email/email.module';

import { SubscribersModule } from './Modules/subscribers/subscribers.module';

import { CompanyModule } from './Modules/Company-management/company.module';
import { MenuItemModule } from './Modules/menu-management/menu-item/menu-item.module';
import { MenuCategoryModule } from './Modules/menu-management/menu-category/menu-category.module';
import { ClientModule } from './Modules/client/client.module';
import { EmployeeModule } from './Modules/employee/employee.module';
import { LeaveModule } from './Modules/leave-request/leave.module';
import { PreSalaryModule } from './Modules/pre-salary/pre-salary.module';
import { RiskReportModule } from './Modules/risk-report/risk-report.module';
import { SocketModule } from './Global/socket/socket.module';
import { CompanyNotificationModule } from './Modules/company-notification/company-notification.module';
import { PushNotificationsModule } from './Modules/push-notification/push-notification.module';
import { StockModule } from './Modules/stock/stock.module';


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
     
    EmailModule,
    CommonModule,
    AdminModule,

    TestimonialModule,
    BlogModule,
    ContactModule,
    OrderModule,

    SubscribersModule,
    CompanyModule,
    MenuItemModule,
    MenuCategoryModule,
    ClientModule,
    EmployeeModule,
    LeaveModule,
    PreSalaryModule,
    RiskReportModule,
    SocketModule,
    CompanyNotificationModule,
    PushNotificationsModule,
    StockModule
  ],
  controllers: [],
})
export class AppModule {}
