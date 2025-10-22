import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!,
    },
    tls: {
      rejectUnauthorized: false,  // Important for security: do not disable in production!
    },
  });

  /**
   * Sends an email with the given subject, recipient, and dynamic template data.
   * @param to - Recipient email address (string or array)
   * @param subject - Email subject (dynamic)
   * @param templateName - Name of the handlebars template file (without extension)
   * @param templateData - Data to populate the template placeholders
   */
  async sendEmail(
  to: string | string[],
  subject: string,
  templateName: string,
  templateData: Record<string, any>
  ) {
    if (!to || !subject || !templateName) {
      throw new BadRequestException('Email recipient, subject and template are required.');
    }

    const templatePath = path.join(process.cwd(), 'src', 'Templates', `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      this.logger.error(`Email template "${templateName}" not found at ${templatePath}`);
      throw new BadRequestException('Email template not found');
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const html = template(templateData);

    try {
      await this.transporter.sendMail({
        from: `abyhr <${process.env.SMTP_USERNAME}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw new Error('Email sending failed');
    }
  }
}