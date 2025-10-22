import { Module } from '@nestjs/common';
import { PrismaService } from '../../../Prisma/prisma.service';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';

@Module({
  providers: [ProductReviewService, PrismaService],
  controllers: [ProductReviewController],
})
export class ProductReviewModule {}
