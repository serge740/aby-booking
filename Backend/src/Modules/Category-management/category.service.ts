import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // CREATE a new category
  async create(data: { name: string; subCategory?: string; status?: string }) {
    
    return this.prisma.category.create({ data });
  }

  // GET all categories
  async findAll() {
    return this.prisma.category.findMany();
  }

  // GET single category by ID
  async findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  // UPDATE category by ID
  async update(id: number, data: { name?: string; subCategory?: string; status?: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // DELETE category by ID
  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
