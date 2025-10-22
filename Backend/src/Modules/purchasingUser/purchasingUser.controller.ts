import { Controller, Post, Body, Get, Query, Patch, Param } from '@nestjs/common';
import { PurchasingUserService } from './purchasingUser.service';

@Controller('purchasing-users')
export class PurchasingUserController {
  constructor(private readonly userService: PurchasingUserService) {}

  // Create or return existing user
  @Post()
  async createOrGetUser(@Body() body: { name: string; email: string; phoneNumber: string }) {
    return this.userService.createOrGetUser(body);
  }

  // ✅ Fetch all users
  @Get('all')
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  // Find user
  @Get()
  async findUser(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
  ) {
    return this.userService.findUser({ id, email, phoneNumber });
  }

  // Update user
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; phoneNumber?: string; password?: string },
  ) {
    return this.userService.updateUser(id, body);
  }
}
