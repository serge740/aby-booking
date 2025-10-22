import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() body: { fullName: string; email: string; password: string }) {
    return this.userService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout() {
    return this.userService.logout();
  }

  @Patch('lock/:id')
  @UseGuards(AuthGuard)
  lock(@Param('id') id: string, @Query('lock') lock: string) {
    return this.userService.lockUser(id, lock === 'true');
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('profile/me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return this.userService.getUser(req.user.id);
  }
}
