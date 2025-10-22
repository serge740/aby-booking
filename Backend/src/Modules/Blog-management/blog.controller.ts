import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { BlogService } from './blog.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BlogFileFields, blogUploadConfig } from 'src/common/Utils/file-upload.util';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor(BlogFileFields,blogUploadConfig))
  create(@Body() data: { title: string; description: string; quote?: string; image?: string }, @UploadedFiles()  files:{ blog_image: Express.Multer.File[]} ) {
    if(files.blog_image){
      data.image = `/uploads/blog-photos/${files.blog_image?.[0].filename}`
    }
    return this.blogService.create(data);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
   @UseInterceptors(FileFieldsInterceptor(BlogFileFields,blogUploadConfig))
  update(@Param('id') id: string, @Body() data: { title?: string; description?: string; quote?: string; image?: string }, @UploadedFiles()  files:{ blog_image: Express.Multer.File[]}) {
    if(files.blog_image){
      data.image = `/uploads/blog-photos/${files.blog_image?.[0].filename}`
    }
    return this.blogService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Post(':id/replies')
  addReply(@Param('id') blogId: string, @Body() data: { fullName: string; email: string; message: string }) {
    return this.blogService.addReply(blogId, data);
  }

  @Get(':id/replies')
  getReplies(@Param('id') blogId: string) {
    return this.blogService.getReplies(blogId);
  }
}
