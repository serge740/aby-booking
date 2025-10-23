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
