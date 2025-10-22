import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';

@Controller('product-reviews')
export class ProductReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Post()
  async create(@Body() body: {
    productId: string;
    fullName: string;
    email: string;
    rating: number;
    comment: string;
  }) {
    return this.reviewService.createReview(body);
  }

  @Get(':productId')
  async findAll(@Param('productId') productId: string) {
    return this.reviewService.getReviews(productId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }
}
