import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  create(@Body('email') email: string) {
    return this.subscribersService.create(email);
  }

  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('email') email: string) {
    return this.subscribersService.update(+id, email);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subscribersService.delete(+id);
  }
}