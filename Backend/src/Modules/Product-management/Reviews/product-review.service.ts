import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../Prisma/prisma.service';

@Injectable()
export class ProductReviewService {
  constructor(private prisma: PrismaService) {}

  // Create a review and update product's average rating
  async createReview(data: {
    productId: string;
    fullName: string;
    email: string;
    rating: number;
    comment: string;
  }) {
    // Create review
    const review = await this.prisma.productReview.create({
      data,
    });

    // Recalculate average rating
    const reviews = await this.prisma.productReview.findMany({
      where: { productId: data.productId },
    });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: data.productId },
      data: { review: avgRating },
    });

    return review;
  }

  // Get all reviews for a product
  async getReviews(productId: string) {
    return this.prisma.productReview.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Delete a review
  async deleteReview(id: string) {
    const review = await this.prisma.productReview.delete({
      where: { id },
    });

    // Recalculate average rating
    const reviews = await this.prisma.productReview.findMany({
      where: { productId: review.productId },
    });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await this.prisma.product.update({
      where: { id: review.productId },
      data: { review: avgRating },
    });

    return review;
  }
}
