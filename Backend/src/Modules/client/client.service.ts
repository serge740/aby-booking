import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/Global/email/email.service';

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  // Create new client or return existing one
  async createOrGetClient(data: { name: string; email: string; phoneNumber?: string }) {
    const { name, email, phoneNumber } = data;

    // Check if client exists
    let client = await this.prisma.client.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (client) return client;

    // Generate random password
    const rawPassword = uuidv4().slice(0, 8); // 8 chars
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create client
    client = await this.prisma.client.create({
      data: { name, email, phoneNumber, password: hashedPassword },
    });

    const currentYear = new Date().getFullYear();
    // Send welcome email
    await this.email.sendEmail(
      email,
      'Welcome to Fresh Cart',
      'Welcome-User-notification', // HBS template name
      {
        name,
        email,
        phoneNumber,
        company_name:'Fresh Cart',
        loginUrl:`${process.env.FRONTEND_URL}/auth/client/login`,
        password: rawPassword,
        year: currentYear,
      },
    );

    return { client, rawPassword };
  }

  // Fetch all clients
  async findAllClients() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find client by ID, email, or phone
  async findClient(query: { id?: string; email?: string; phoneNumber?: string }) {
    const client = await this.prisma.client.findFirst({ where: query });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  // Update client by ID
  async updateClient(
    id: string,
    data: { name?: string; email?: string; phoneNumber?: string; password?: string },
  ) {
    try {
      const client = await this.prisma.client.update({
        where: { id },
        data,
      });
      return client;
    } catch (error) {
      throw new BadRequestException('Failed to update client');
    }
  }
}
