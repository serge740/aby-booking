import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PurchasingUserAuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async registerUser(
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) {
    if (!email || !password || !name || !phoneNumber)
      throw new BadRequestException('All fields are required');
    if (!this.emailRegex.test(email))
      throw new BadRequestException('Invalid email');
    if (password.length < 6)
      throw new BadRequestException('Password too short');

    const exists = await this.prisma.purchasingUser.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.purchasingUser.create({
      data: { name, email, phoneNumber, password: hashedPassword },
    });

    return { message: 'PurchasingUser registered', user };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.purchasingUser.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    });

    return { user, token };
  }

  async getProfile(userId: string) {
    return await this.prisma.purchasingUser.findUnique({ where: { id: userId } });
  }

  async editProfile(userId: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.prisma.purchasingUser.update({
      where: { id: userId },
      data,
    });
  }
}
