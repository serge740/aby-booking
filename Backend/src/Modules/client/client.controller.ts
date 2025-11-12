import { Controller, Post, Body, Get, Query, Patch, Param } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // Create new client or return existing
  @Post()
  async createOrGetClient(@Body() body: { name: string; email: string; phoneNumber?: string }) {
    return this.clientService.createOrGetClient(body);
  }

  // Fetch all clients
  @Get('all')
  async findAllClients() {
    return this.clientService.findAllClients();
  }

  // Find client by query params
  @Get()
  async findClient(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
  ) {
    return this.clientService.findClient({ id, email, phoneNumber });
  }

  // Update client by ID
  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; phoneNumber?: string; password?: string },
  ) {
    return this.clientService.updateClient(id, body);
  }
}
