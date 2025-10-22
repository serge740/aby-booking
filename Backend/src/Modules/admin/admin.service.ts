import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from '../../../generated/prisma';


@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 async registerAdmin(
  email: string,
  password: string,
  names: string,
  role: AdminRole = AdminRole.ADMIN, // default as enum
) {
  if (!email || !password || !names) throw new BadRequestException('All fields are required');
  if (!this.emailRegex.test(email)) throw new BadRequestException('Invalid email');
  if (password.length < 6) throw new BadRequestException('Password too short');

  const exists = await this.prisma.admin.findUnique({ where: { email } });
  if (exists) throw new BadRequestException('Admin already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await this.prisma.admin.create({
    data: { email, password: hashedPassword, names, role },
  });

  return { message: 'Admin registered', admin };
}

  async adminLogin({ email, password }: { email: string; password: string }) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: admin.id, role: admin.role, email: admin.email, names: admin.names });
    return { admin, token };
  }

  async getAdminProfile(adminId: string) {
    return await this.prisma.admin.findUnique({ where: { id: adminId } });
  }

  async editAdminProfile(adminId: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.prisma.admin.update({ where: { id: adminId }, data });
  }
}
