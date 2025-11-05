import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Status } from 'generated/prisma';

@Injectable()
export class ClientService {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // -----------------------------
  // FIND METHODS
  // -----------------------------
  async findClientById(id: string) {
    if (!id) throw new BadRequestException('Client ID is required');
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async findClientByEmail(email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const client = await this.prisma.client.findUnique({ where: { email } });
    return client;
  }

  async findClientByLogin(login: string) {
    const client = await this.prisma.client.findFirst({
      where: { OR: [{ email: login }, { phoneNumber: login }] },
    });
    if (!client) throw new UnauthorizedException('Client not found');
    return client;
  }


  // Get client profile
async getClientProfile(clientId: string) {
  const client = await this.prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      profileImage: true,
      status: true,
      createdAt: true,
    },
  });

  if (!client) {
    throw new NotFoundException('Client not found');
  }

  return client;
}


  // -----------------------------
  // AUTH METHODS
  // -----------------------------
  async registerClient(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const { name, email, phoneNumber, password } = data;

    if (!email || !name || !password || !phoneNumber)
      throw new BadRequestException('All input fields are required');

    if (!this.emailRegex.test(email))
      throw new BadRequestException('Invalid email format');

    const existing = await this.findClientByEmail(email);
    if (existing) throw new ConflictException('Client already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await this.prisma.client.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });

    return { message: 'Client registered successfully', clientId: newClient.id };
  }

  async clientLogin(data: { login: string; password: string }) {
    const { login, password } = data;
    const client = await this.findClientByLogin(login);

    if (client.status === Status.INACTIVE)
      throw new UnauthorizedException('Account is inactive');

    const isPasswordValid = await bcrypt.compare(password, client.password ?? '');
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: client.id, role: 'client' });
    return {
      token,
      authenticated: true,
      message: 'Login successful',
      client,
    };
  }

  async changePassword(clientId: string, currentPassword: string, newPassword: string) {
    if (!clientId) throw new BadRequestException('Client ID is required');
    if (!currentPassword || !newPassword)
      throw new BadRequestException('Both passwords are required');
    if (newPassword.length < 6)
      throw new BadRequestException('New password must be at least 6 characters long');

    const client = await this.findClientById(clientId);
    if (!client.password) throw new UnauthorizedException('No password set');

    const isMatch = await bcrypt.compare(currentPassword, client.password);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.client.update({
      where: { id: clientId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  // -----------------------------
  // CLIENT UPDATE
  // -----------------------------
  async updateClient(
    id: string,
    data: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      profileImage?: string; // path or URL
      status?: 'ACTIVE' | 'INACTIVE';
    },
  ) {
    if (!id) throw new BadRequestException('Client ID is required');
    const existing = await this.findClientById(id);
    if (!existing) throw new NotFoundException('Client not found');

    if (data.email) {
      if (!this.emailRegex.test(data.email))
        throw new BadRequestException('Invalid email format');
      const emailExists = await this.prisma.client.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (emailExists) throw new ConflictException('Email already taken');
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data,
    });

    return {
      message: 'Client updated successfully',
      client: updatedClient,
    };
  }

  // -----------------------------
  // DELETE / LOGOUT
  // -----------------------------
  async deleteClient(id: string) {
    if (!id) throw new BadRequestException('Client ID is required');
    const client = await this.findClientById(id);
    if (!client) throw new NotFoundException('Client not found');

    await this.prisma.client.delete({ where: { id } });
    return { message: 'Client deleted successfully' };
  }

  async logout(res: Response, clientId: string) {
    if (!clientId) throw new BadRequestException('Client ID is required');
    const client = await this.findClientById(clientId);
    if (!client) throw new NotFoundException('Client not found');

    res.clearCookie('client_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  return  res.json({ message: 'Logged out successfully' }) ;
  }
}
