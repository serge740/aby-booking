import { HttpException, Injectable } from '@nestjs/common';
import { deleteFile } from 'src/common/Utils/file-upload.util';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class MenuCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, name: string, image?: string) {
    if (!name) throw new HttpException('Category name is required', 400);

    return await this.prisma.menuCategory.create({
      data: {
        name,
        companyId,
        image
      } ,
     include: { items: true ,company:true } 
    });
  }

  async findAll() {
    return await this.prisma.menuCategory.findMany({
     
      include: { items: true ,company:true }
    });
  }
  async findByCompanyId(companyId: string) {
    return await this.prisma.menuCategory.findMany({
      where: { companyId },
      include: { items: true ,company:true }
    });
  }

  async update(companyId: string, categoryId: string, name: string,image?:string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId }
    });

    
    if (!category || category.companyId !== companyId)
      throw new HttpException('Category not found or unauthorized', 403);

    const updateCategory =  await this.prisma.menuCategory.update({
      where: { id: categoryId },
      data: { name,image },
      include: { items: true ,company: true }
    });

    if(image && category.image){
      deleteFile(category.image)
    }

    return updateCategory;

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

    if(category.image){
     deleteFile(category.image)
   }
    return await this.prisma.menuCategory.delete({
      where: { id: categoryId }
    });


  }
}
