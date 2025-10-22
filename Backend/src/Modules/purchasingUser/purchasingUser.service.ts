import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/Global/email/email.service';
// import { EmailService } from 'src/Global/email/email.service';

@Injectable()
export class PurchasingUserService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  // Create or return existing user
  async createOrGetUser(data: { name: string; email: string; phoneNumber: string }) {
    const { name, email, phoneNumber } = data;

    // Check if user exists
    let user = await this.prisma.purchasingUser.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (user) return user;

    // Generate random password
    const rawPassword = uuidv4().slice(0, 8); // 8 chars
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create user
    user = await this.prisma.purchasingUser.create({
      data: { name, email, phoneNumber, password: hashedPassword },
    });

    const currentYear = new Date().getFullYear();
    await this.email.sendEmail(
      email,
      'Welcome to AbyTech Store',
      'purchasing-user-welcome', // name of the HBS template
      {
        name:name,
        email:email,
        phoneNumber:phoneNumber,
        password: rawPassword,
        year: currentYear,
      },
    );

    // Optionally send welcome email here
    return { user, rawPassword };
  }

  // ✅ Fetch all users
  async findAllUsers() {
    return await this.prisma.purchasingUser.findMany({
      orderBy: { createdAt: 'desc' }, // newest first
    });
  }

  // Find user by ID, email, or phone
  async findUser(query: { id?: string; email?: string; phoneNumber?: string }) {
    const user = await this.prisma.purchasingUser.findFirst({ where: query });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update user by ID
  async updateUser(
    id: string,
    data: { name?: string; email?: string; phoneNumber?: string; password?: string },
  ) {
    try {
      const user = await this.prisma.purchasingUser.update({
        where: { id },
        data,
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }
}
