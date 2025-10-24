// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './Modules/admin/admin.module';
import { CategoryModule } from './Modules/Category-management/category.module';
import { ProductModule } from './Modules/Product-management/product.module';
import { PartnerModule } from './Modules/partner-management/partner.module';
import { TestimonialModule } from './Modules/testmonial-management/testmonial.module';
import { BlogModule } from './Modules/Blog-management/blog.module';
import { ContactModule } from './Modules/Contact-us/contact.module';
import { OrderModule } from './Modules/order-management/order.module';
import { PaymentModule } from './Modules/payment-management/payment.module';
import { EmailModule } from './Global/email/email.module';

import { SubscribersModule } from './Modules/subscribers/subscribers.module';
import { PurchasingUserModule } from './Modules/purchasingUser/purchasingUser.module';
import { CompanyModule } from './Modules/Company-management/company.module';
import { MenuItemModule } from './Modules/menu-management/menu-item/menu-item.module';
import { MenuCategoryModule } from './Modules/menu-management/menu-category/menu-category.module';
@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule in every module
    }),
    EmailModule,
    CommonModule,
    AdminModule,
    CategoryModule,
    ProductModule,
    PartnerModule,
    TestimonialModule,
    BlogModule,
    ContactModule,
    OrderModule,
    PaymentModule,
    SubscribersModule,
    PurchasingUserModule,
    CompanyModule,
    MenuItemModule,
    MenuCategoryModule,
  ],
  controllers: [],
})
export class AppModule {}
