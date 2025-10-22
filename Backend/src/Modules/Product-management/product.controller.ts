// src/product/product.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  ParseIntPipe,
  ParseFloatPipe,
  ParseBoolPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { parse } from 'path';
// Define the expected body structure
// Define the expected body structure
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 4))
  async createProduct(
    @Body() body: any, // Could add minimal typing if desired
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // 🔍 Debug logs
      console.log('📥 Incoming product creation request');
      console.log('➡️ Body received:', body);
      console.log(
        '➡️ Files received:',
        files?.map((f) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          filename: f.filename,
        })),
      );

      // Process uploaded files
      const imageUrls = files
        ? files.map((file) => `/uploads/products/${file.filename}`)
        : [];

      // Parse and validate request body
      const productData = {
        name: body.name,
        images: imageUrls,
        brand: body.brand,
        size: body.size,
        quantity: parseInt(body.quantity, 10),
        price: parseFloat(body.price),
        perUnit: body.perUnit,
        description: body.description,
        subDescription: body.subDescription, // string | undefined
        discount: parseInt(body.discount),
        review: body.review ? parseFloat(body.review) : 0,
        availability: body.availability ? body.availability === 'true' : true,
        tags: body.tags ? JSON.parse(body.tags) : [],
        categoryId: parseInt(body.categoryId, 10),
      };

      // 🔍 Debug parsed product data
      console.log('✅ Parsed productData:', productData);

      // Validate required fields
      if (
        !productData.name ||
        !productData.brand ||
        !productData.size ||
        !productData.description ||
        isNaN(productData.categoryId) || // Validate categoryId
        isNaN(productData.quantity) || // Validate quantity
        isNaN(productData.price) // Validate price
      ) {
        throw new BadRequestException('Missing or invalid required fields');
      }

      return await this.productService.createProduct(productData);
    } catch (error) {
      console.error('❌ Error creating product:', error.message);
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Get all products with filters and pagination
   * GET /products
   */
  @Get()
  async getAllProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('size') size?: string,
    @Query('availability') availability?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
  ) {
    try {
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      const filters = {
        category,
        brand,
        size,
        availability: availability ? availability === 'true' : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        search,
      };

      return await this.productService.getAllProducts(page, limit, filters);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get single product by ID
   * GET /products/:id
   */
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }
    return await this.productService.getProductById(id);
  }

  /**
   * Update product
   * PUT /products/:id
   */
@Put(':id')
@UseInterceptors(FilesInterceptor('images', 4))
async updateProduct(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFiles() files: Express.Multer.File[],
) {
  try {
    if (!id) throw new BadRequestException('Product ID is required');

    const updateData: any = {};

    // ✅ Handle new uploaded files
    const newImages = files?.map(file => `/uploads/products/${file.filename}`) || [];
    updateData.newImages = newImages;

    // ✅ Parse keepImages from body
    if (body.keepImages) {
      try {
        const keepImages = JSON.parse(body.keepImages);
        if (!Array.isArray(keepImages)) throw new Error();
        updateData.keepImages = keepImages;
      } catch {
        throw new BadRequestException('Invalid keepImages format - must be a JSON array');
      }
    }

    // ✅ Map other fields if provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.size !== undefined) updateData.size = body.size;
    if (body.quantity !== undefined) updateData.quantity = parseInt(body.quantity);
    if (body.discount !== undefined) updateData.discount = parseInt(body.discount);
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.perUnit !== undefined) updateData.perUnit = body.perUnit;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.subDescription !== undefined) updateData.subDescription = body.subDescription;
    if (body.review !== undefined) updateData.review = parseFloat(body.review);
    if (body.availability !== undefined) updateData.availability = body.availability === 'true';
    if (body.tags !== undefined) updateData.tags = JSON.parse(body.tags);
    if (body.categoryId !== undefined) updateData.categoryId = Number(body.categoryId);

    return await this.productService.updateProduct(id, updateData);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  /**
   * Delete product
   * DELETE /products/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }
    return await this.productService.deleteProduct(id);
  }

  /**
   * Bulk update availability
   * PUT /products/bulk/availability
   */
  @Put('bulk/availability')
  async bulkUpdateAvailability(
    @Body() body: { productIds: string[]; availability: boolean }
  ) {
    try {
      if (!body.productIds || !Array.isArray(body.productIds) || body.productIds.length === 0) {
        throw new BadRequestException('productIds array is required and cannot be empty');
      }

      if (typeof body.availability !== 'boolean') {
        throw new BadRequestException('availability must be a boolean value');
      }

      return await this.productService.bulkUpdateAvailability(
        body.productIds, 
        body.availability
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   

  /**
   * Update product quantity
   * PUT /products/:id/quantity
   */
  @Put(':id/quantity')
  async updateProductQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number }
  ) {
    try {
      if (!id) {
        throw new BadRequestException('Product ID is required');
      }

      if (typeof body.quantity !== 'number' || body.quantity < 0) {
        throw new BadRequestException('Valid quantity is required');
      }

      return await this.productService.updateProductQuantity(id, body.quantity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get low stock products
   * GET /products/inventory/low-stock
   */
  @Get('inventory/low-stock')
  async getLowStockProducts(
    @Query('threshold', new DefaultValuePipe(5), ParseIntPipe) threshold: number,
  ) {
    try {
      if (threshold < 0) {
        throw new BadRequestException('Threshold must be a positive number');
      }

      return await this.productService.getLowStockProducts(threshold);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Search products by name or description
   * GET /products/search
   */
  @Get('search/query')
  async searchProducts(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      if (!query || query.trim().length === 0) {
        throw new BadRequestException('Search query is required');
      }

      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      return await this.productService.getAllProducts(page, limit, { search: query.trim() });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

