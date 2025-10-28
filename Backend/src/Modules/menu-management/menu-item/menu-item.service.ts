import { HttpException, Injectable } from '@nestjs/common';
import { deleteFile } from 'src/common/Utils/file-upload.util';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) { }

  async create(companyId: string, data: any) {
    const { name, price, categoryId } = data;

    if (!name || !price)
      throw new HttpException('Name & price are required', 400);

    if (categoryId) {
      const category = await this.prisma.menuCategory.findUnique({
        where: { id: categoryId }
      });
      if (!category || category.companyId !== companyId)
        throw new HttpException('Invalid category', 403);
    }

    return await this.prisma.menuItem.create({
      data: {
        ...data,
        companyId,
        price: parseFloat(price)
      }
    });
  }

  async findAll(companyId: string) {
    return await this.prisma.menuItem.findMany({
      where: { companyId },
      include: { category: true }
    });
  }

  async update(companyId: string, id: string, data: any) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id }
    });

    if (!item || item.companyId !== companyId)
      throw new HttpException('Item not found or unauthorized', 403);

    if (data.categoryId) {
      const category = await this.prisma.menuCategory.findUnique({
        where: { id: data.categoryId }
      });
      if (!category || category.companyId !== companyId)
        throw new HttpException('Invalid category', 403);
    }

    const removedImages: string[] = data.removedImages ?? [];
    const newImages: string[] = data.otherImages ?? [];

    // Safely handle nullable array field
    const existingImages = Array.isArray(item.otherImages)
      ? item.otherImages.filter((v): v is string => typeof v === 'string')
      : [];


    // Remove images requested to delete
    const filteredImages = existingImages.filter(img => !removedImages.includes(img));

    // Combine images
    const finalImages = [...filteredImages, ...newImages];


    const updatedMenuItem = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : item.price,
        otherImages: finalImages
      }
    });

    // Delete old main image if changed
    if (data.mainImage && item.mainImage && data.mainImage !== item.mainImage) {
      deleteFile(item.mainImage);
    }


    // Delete removed images
    if (removedImages.length > 0) {
      for (const imgPath of removedImages) {
        deleteFile(imgPath);
      }
    }

    return updatedMenuItem;
  }


  async delete(companyId: string, id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id }
    });

    if (!item || item.companyId !== companyId)
      throw new HttpException('Unauthorized delete', 403);

    return await this.prisma.menuItem.delete({
      where: { id }
    });
  }
}
