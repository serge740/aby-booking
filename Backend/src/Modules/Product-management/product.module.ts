// src/product/product.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../Prisma/prisma.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductReviewModule } from './Reviews/product-review.module';

@Module({
  imports: [
    // Configure multer for file uploads
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/products', // Make sure this directory exists
        filename: (req, file, callback) => {
          // Generate unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Only allow image files
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 4, // Maximum 4 files
      },
    }),
    ProductReviewModule
  ],
  controllers: [ProductController,],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}