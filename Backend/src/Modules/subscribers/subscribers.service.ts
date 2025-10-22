import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';  // Adjust path if needed

@Injectable()
export class SubscribersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string) {
    return this.prisma.subscriber.create({
      data: { email },
    });
  }

  async findAll() {
    return this.prisma.subscriber.findMany();
  }

  async findOne(id: number) {
    return this.prisma.subscriber.findUnique({
      where: { id },
    });
  }

  async update(id: number, email: string) {
    return this.prisma.subscriber.update({
      where: { id },
      data: { email },
    });
  }

  async delete(id: number) {
    return this.prisma.subscriber.delete({
      where: { id },
    });
  }
}