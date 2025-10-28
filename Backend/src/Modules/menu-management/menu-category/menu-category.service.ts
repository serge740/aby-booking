import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class MenuCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, name: string) {
    if (!name) throw new HttpException('Category name is required', 400);

    return await this.prisma.menuCategory.create({
      data: {
        name,
        companyId
      } ,
     include: { items: true ,company:true } 
    });
  }

  async findAll(companyId: string) {
    return await this.prisma.menuCategory.findMany({
      where: { companyId },
      include: { items: true ,company:true }
    });
  }

  async update(companyId: string, categoryId: string, name: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category || category.companyId !== companyId)
      throw new HttpException('Category not found or unauthorized', 403);

    return await this.prisma.menuCategory.update({
      where: { id: categoryId },
      data: { name },
      include: { items: true ,company: true }
    });
  }

  async delete(companyId: string, categoryId: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category || category.companyId !== companyId)
      throw new HttpException('Unauthorized delete', 403);

    await this.prisma.menuItem.updateMany({
      where: { categoryId },
      data: { categoryId: null }
    });

    return await this.prisma.menuCategory.delete({
      where: { id: categoryId }
    });
  }
}
