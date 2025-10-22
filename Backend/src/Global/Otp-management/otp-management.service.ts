import { Injectable, Logger } from '@nestjs/common';

interface OtpRecord {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class OtpManagementService {

  private readonly logger = new Logger(OtpManagementService.name);
  private otpStore = new Map<string, OtpRecord>();

  // Generate a numeric OTP of given length (default 6 digits)
  generateOtp(length = 6): string {
    const otp = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
    this.logger.debug(`Generated OTP: ${otp}`);
    return otp;
  }

  // Store OTP for identifier with TTL (seconds)
  async storeOtp(identifier: string, otp: string, ttlSeconds: number) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.otpStore.set(identifier, { otp, expiresAt });
    this.logger.debug(`Stored OTP for ${identifier}, expires at ${new Date(expiresAt).toISOString()}`);
  }

  // Verify OTP: check if exists, not expired and matches
  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; message: string }> {
    const record = this.otpStore.get(identifier);
    if (!record) {
      return { success: false, message: 'OTP not found' };
    }
    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(identifier);
      return { success: false, message: 'OTP expired' };
    }
    if (record.otp !== otp) {
      return { success: false, message: 'OTP invalid' };
    }
    return { success: true, message: 'OTP verified' };
  }

  // Optional: Delete OTP after verification or manually
  async deleteOtp(identifier: string) {
    this.otpStore.delete(identifier);
    this.logger.debug(`Deleted OTP for ${identifier}`);
  }
  maskIdentifier(identifier: string): string {
  if (identifier.includes('@')) {
    // Mask email: example -> t***@domain.com
    const [name, domain] = identifier.split('@');
    if (name.length <= 1) return `*@${domain}`;
    return name[0] + '*'.repeat(name.length - 1) + '@' + domain;
  } else {
    // Mask phone: keep last 4 digits visible, mask rest
    if (identifier.length <= 4) return '*'.repeat(identifier.length);
    const visible = identifier.slice(-4);
    const masked = '*'.repeat(identifier.length - 4);
    return masked + visible;
  }
}

}
