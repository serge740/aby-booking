import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { deleteFile } from 'src/common/Utils/file-upload.util';
import { EmailService } from 'src/Global/email/email.service';
import { last } from 'rxjs';

@Injectable()
export class CompanyService {
    constructor(
        private prisma: PrismaService,
        private email:EmailService
    ) { }

    // 🔐 Generate random plain password
    private generatePassword(length = 10): string {
        return randomBytes(length).toString('base64').slice(0, length);
    }

    // 🔒 Hash password using bcrypt
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    // ✅ CREATE COMPANY
    async createCompany(data: {
        name: string;
        email?: string;
        phone?: string;
        description?: string;
        logo?: string;
        address?: string;
        city?: string;
        country?: string;
        isActive:string;
        type?: string;
    }) {
        if (!data.name) throw new BadRequestException('Company name is required');

       
          
        

        // Generate & hash password
        const plainPassword = this.generatePassword();
        const hashedPassword = await this.hashPassword(plainPassword);
        
        if (data.email) {

              const exists = await this.prisma.company.findUnique({ where: { email: data.email } });
            if (exists) throw new BadRequestException('Email already exists');
            // send email to company with generated password
            const subject = 'Your Company Account Created';

            await this.email.sendEmail(
                data.email,
                subject,
                'Welcome-User-notification',
                {
                    firstName: data.name ? data.name.split(" ")[0] : '',
                    lastName: data.name ? last.call(data.name.split(" ")) : '',
                    email: data.email,
                    loginUrl: `${process.env.FRONTEND_URL}/auth/company/login`,
                    password: plainPassword,
                    year: new Date().getFullYear(),
                }
            );
        }


        const company = await this.prisma.company.create({
            data: {
                ...data,
                password: hashedPassword,
                isActive: JSON.parse(String(data.isActive )),
                type: (data.type as any) || 'OTHER',
            },
        });

        // Return the created company + plain password (for emailing)
        return {
            ...company,
            generatedPassword: plainPassword,
        };
    }

    // ✅ GET ALL COMPANIES
    async getCompanies() {
        return this.prisma.company.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    // ✅ GET ONE
    async getCompanyById(id: string) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) throw new NotFoundException('Company not found');
        return company;
    }

    // ✅ UPDATE
    async updateCompany(
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


    // ✅ DELETE
    async deleteCompany(id: string) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) throw new NotFoundException('Company not found');

        await this.prisma.company.delete({ where: { id } });
        return { message: 'Company deleted successfully' };
    }
}
