// src/contact/contact.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async handleContact(@Body() body: any) {
    return this.contactService.processContact(body);
  }
    @Get()
  async getAllMessages() {
    return this.contactService.getAllMessages();
  }

@Delete(':id')
async deleteMessage(@Param('id') id: string) {
  return this.contactService.deleteMessage(id);
}

}
