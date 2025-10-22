import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new blog
  create(data: { title: string; description: string; quote?: string; image?: string }) {
    return this.prisma.blog.create({ data });
  }

  // Get all blogs
  findAll() {
    return this.prisma.blog.findMany({ include: { replies: true } });
  }

  // Get a single blog by ID
  findOne(id: string) {
    return this.prisma.blog.findUnique({ where: { id }, include: { replies: true } });
  }

  // Update blog
  update(id: string, data: { title?: string; description?: string; quote?: string; image?: string }) {
    return this.prisma.blog.update({ where: { id }, data });
  }

  // Delete blog
  remove(id: string) {
    return this.prisma.blog.delete({ where: { id } });
  }

  // Add reply/comment to a blog
  addReply(blogId: string, data: { fullName: string; email: string; message: string }) {
    return this.prisma.blogReply.create({
      data: { ...data, blogId },
    });
  }

  // Get all replies for a blog
  getReplies(blogId: string) {
    return this.prisma.blogReply.findMany({ where: { blogId } });
  }
}
