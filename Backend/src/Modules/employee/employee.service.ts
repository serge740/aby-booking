import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/Prisma/prisma.service';
import { EmployeeStatus, MaritalStatus } from 'generated/prisma';
import { deleteFile } from 'src/common/Utils/file-upload.util';
import { EmailService } from 'src/Global/email/email.service';
import { generatePassword } from 'src/common/Utils/GeneratePassword.utils';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async create(data: {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: Date;
    phone: string;
    email: string;
    address: string;
    national_id: string;
    profile_picture?: string;
    cv?: string;
    application_letter?: string;
    position: string;
    departmentId: string;
    marital_status?: MaritalStatus;
    date_hired: Date;
    status?: EmployeeStatus;
    bank_account_number?: string;
    bank_name?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    experience?: any[];
    companyId: string; // ✅ changed from adminId
  }) {
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        companyId: data.companyId,
        OR: [
          { phone: data.phone },
          { email: data.email },
          { national_id: data.national_id },
        ],
      },
    });

    if (existingEmployee) {
      throw new ConflictException(
        'Employee already exists with provided phone, email, or national ID',
      );
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdEmployee = await this.prisma.employee.create({
      data: {
        ...data,
        password: hashedPassword,
        experience: data.experience || [],
        marital_status: data.marital_status || MaritalStatus.SINGLE,
        status: data.status || EmployeeStatus.ACTIVE,
      },
    });

    await this.email.sendEmail(
      createdEmployee.email,
      'Welcome to the Company',
      'Employee-registration-success',
      {
        firstname: createdEmployee.first_name,
        lastname: createdEmployee.last_name,
        password,
        email: createdEmployee.email,
        year: new Date().getFullYear(),
      },
    );

    return createdEmployee;
  }

  async findAll(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      include: { company: true },
    });
  }

  async findOne(id: string,) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, },
      include: { company: true },
    });

    if (!employee) throw new NotFoundException(`Employee not found`);
    return employee;
  }

  async update(
    id: string,
    data: {
      first_name?: string;
      last_name?: string;
      gender?: string;
      date_of_birth?: Date;
      phone?: string;
      email?: string;
      address?: string;
      national_id?: string;
      profile_picture?: string;
      cv?: string;
      application_letter?: string;
      identityCardImage?: string;
      position?: string;
      departmentId?: string;
      marital_status?: MaritalStatus;
      date_hired?: Date;
      status?: EmployeeStatus;
      experience?: any;
      bank_account_number?: string;
      bank_name?: string;
      emergency_contact_name?: string;
      emergency_contact_phone?: string;
      
      password?: string;
      google_id?: string;
      isLocked?: boolean;
      is2FA?: boolean;
    },
  ) {
    const employee = await this.findOne(id);
    if (!employee) throw new Error('Employee not found');

    if (data.profile_picture && employee.profile_picture) deleteFile(employee.profile_picture);
    if (data.cv && employee.cv) deleteFile(employee.cv);
    if (data.application_letter && employee.application_letter)
      deleteFile(employee.application_letter);

        if (data.identityCardImage && employee.identityCardImage)
          deleteFile(employee.identityCardImage);

    return this.prisma.employee.update({
      where: { id },
      data: {
        ...data,
        isLocked:
          typeof data.isLocked === 'string' ? JSON.parse(data.isLocked) : data.isLocked,
        is2FA:
          typeof data.is2FA === 'string' ? JSON.parse(data.is2FA) : data.is2FA,
      },
      include: { company: true },
    });
  }

  async remove(id: string, companyId: string) {
    const employee = await this.findOne(id);

    if (employee.profile_picture) deleteFile(employee.profile_picture);
    if (employee.cv) deleteFile(employee.cv);
    if (employee.application_letter) deleteFile(employee.application_letter);

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
