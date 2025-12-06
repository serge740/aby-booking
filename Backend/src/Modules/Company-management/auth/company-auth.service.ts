import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { deleteFile } from 'src/common/Utils/file-upload.util';

@Injectable()
export class CompanyAuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async registerCompany(
    name: string,
    email: string,
    phone: string,
    password: string,
  ) {
    if (!email || !password || !name)
      throw new BadRequestException('All required fields must be filled');

    if (!this.emailRegex.test(email))
      throw new BadRequestException('Invalid email address');

    if (password.length < 6)
      throw new BadRequestException('Password too short');

    const exists = await this.prisma.company.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Company already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await this.prisma.company.create({
      data: { name, email, phone, password: hashedPassword },
    });

    return { message: 'Company registered successfully', company };
  }

  async login({ email, password }: { email: string; password: string }) {
    const company = await this.prisma.company.findUnique({ where: { email } });
    if (!company) throw new UnauthorizedException('Company not found');

    const valid = await bcrypt.compare(password, company.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign(
      {
        id: company.id,
        email: company.email,
        name: company.name,
        type: company.type,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    return { company, token };
  }
    // change password
  async changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    if (!companyId) throw new BadRequestException('company ID is required');
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Both current and new password are required');
    }
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    // Find company
    const company =  await this.prisma.company.findUnique({where:{id:companyId}});
    if (!company) throw new NotFoundException('company not found');
    if (!company.password) throw new UnauthorizedException('No password set for this account');

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, company.password);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.company.update({
      where: { id: companyId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async getProfile(companyId: string) {
    return await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        description: true,
        logo: true,
        address: true,
        city: true,
        country: true,
        type: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async editProfile(
          id: string,
          data: {
              name?: string;
              email?: string;
              phone?: string;
              description?: string;
              logo?: string;
              address?: string;
              city?: string;
              country?: string;
              type?: string;
              isActive?: boolean;
              momoCode?: string;
          },
      ) {
          const company = await this.prisma.company.findUnique({ where: { id } });
          if (!company) throw new NotFoundException('Company not found');
  
          // check for duplicate email
          if (data.email && data.email !== company.email) {
              const exists = await this.prisma.company.findUnique({
                  where: { email: data.email },
              });
              if (exists) throw new BadRequestException('Email already exists');
          }
  
  
  
  
          const updatedCompany = await this.prisma.company.update({
              where: { id },
              data: {
                  name: data.name ?? company.name,
                  email: data.email ?? company.email,
                  phone: data.phone ?? company.phone,
                  description: JSON.stringify(data.description) ?? company.description,
                  logo: data.logo ?? company.logo,
                  address: data.address ?? company.address,
                  city: data.city ?? company.city,
                  momoCode:  data.momoCode ?? company.momoCode,
                  country: data.country ?? company.country,
                  type: (data.type as any) ?? company.type,
                  isActive: JSON.parse(String(data.isActive)) ?? company.isActive,
              },
          });
  
          if (data.logo && company.logo) {
              deleteFile(company.logo);
          }
  
          return updatedCompany;
  
      }

}
