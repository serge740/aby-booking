import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CategoryFileFields, CategoryUploadConfig } from 'src/common/Utils/file-upload.util';

/**
 * CategoryController
 * 
 * Handles API endpoints for Category CRUD operations.
 * Base route: /categories
 */
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create a new category
   * POST /categories
   * Body: { name: string, subCategory?: string, status?: string }
   */
  @Post()
   @UseInterceptors(FileFieldsInterceptor(CategoryFileFields, CategoryUploadConfig))
  create(@Body() body: { name: string; subCategory?: string; status?: string,category_image?:string; }, @UploadedFiles() files?: { category_image?: Express.Multer.File[] }) {
      if(files?.category_image){
        console.log(files.category_image);
        
        body.category_image = `/uploads/category-photos/${files?.category_image?.[0].filename}`
    }
    return this.categoryService.create(body);
  }

  /**
   * Get all categories
   * GET /categories
   */
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Get a single category by ID
   * GET /categories/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(Number(id));
  }

  /**
   * Update a category
   * PATCH /categories/:id
   * Body: { name?: string, subCategory?: string, status?: string }
   */
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor(CategoryFileFields, CategoryUploadConfig))
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; category_image?:string; subCategory?: string; status?: string },
    @UploadedFiles() files?: { category_image?: Express.Multer.File[] },
  ) {
      if(files?.category_image){
        body.category_image = `/uploads/category-photos/${files?.category_image?.[0].filename}`
    }
    return this.categoryService.update(Number(id), body);
  }

  /**
   * Delete a category
   * DELETE /categories/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(Number(id));
  }
}
