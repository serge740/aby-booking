// src/admin/otp.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class OTPService {
  // Map to store OTPs in-memory: key = adminId, value = { otp, expiresAt }
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  async generateOTP(adminId: string): Promise<string> {
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    this.otpStore.set(adminId, { otp, expiresAt });

    return otp;
  }

  async verifyOTP(adminId: string, code: string) {
    const entry = this.otpStore.get(adminId);

    if (!entry) throw new UnauthorizedException('OTP expired or invalid');

    if (entry.expiresAt < Date.now()) {
      this.otpStore.delete(adminId);
      throw new UnauthorizedException('OTP expired');
    }

    if (entry.otp !== code) throw new UnauthorizedException('Invalid OTP');

    // OTP verified, remove it
    this.otpStore.delete(adminId);
    return true;
  }
}
