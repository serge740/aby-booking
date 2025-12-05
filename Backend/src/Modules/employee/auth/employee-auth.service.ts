import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OTPService } from 'src/Global/otp/otp.service';
import { EmailService } from 'src/Global/email/email.service';
import { EmployeeService } from '../employee.service';
import { EmployeeStatus, MaritalStatus } from 'generated/prisma';
import { deleteFile } from 'src/common/Utils/file-upload.util';


@Injectable()
export class EmployeeAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OTPService,
    private email: EmailService,
    private employeeService: EmployeeService,
  ) {}

  async findEmployeeByEmailOrPhone(identifier: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!employee) throw new UnauthorizedException('Employee not found');
    return employee;
  }

  async employeeLogin(data: { identifier: string; password: string }) {
    const { identifier, password } = data;

    const employee = await this.findEmployeeByEmailOrPhone(identifier);

    const isPasswordValid = await bcrypt.compare(
      password,
      employee.password ?? '',
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      id: employee.id,
      role: 'employee',
    });

    return { token, twoFARequired: false, authenticated: true };
  }

 

  async changePassword(
    employeeId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const isMatch = await bcrypt.compare(
      currentPassword,
      employee.password ?? '',
    );
    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.employee.update({
      where: { id: employeeId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  // Lock employee account
async lockEmployee(id: string) {
  try {
    const employee = await this.employeeService.findOne(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const lockedEmployee = await this.prisma.employee.update({
      where: { id },
      data: { isLocked: true },
    });
    return { message: `Employee ${lockedEmployee.email} has been locked.` };
  } catch (error) {
    console.error('Error locking employee', error);
    throw new Error(error.message);
  }
}

// Unlock employee account
async unlockEmployee(id: string, body: { password: string }) {
  try {
    if (!id) {
      throw new BadRequestException('Employee id is required');
    }
    if (!body.password || body.password.length < 6) {
      throw new BadRequestException(
        'Password is required and must be at least 6 characters long',
      );
    }

    const employee = await this.employeeService.findOne(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (!employee.isLocked) {
      throw new BadRequestException('Employee is not locked');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      String(employee.password),
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    await this.prisma.employee.update({
      where: { id },
      data: { isLocked: false },
    });

    return { message: 'Employee unlocked successfully' };
  } catch (error) {
    console.error('Error unlocking employee:', error);
    throw new Error(error.message);
  }
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


 async findOne(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    return employee;
  }

}
