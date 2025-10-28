import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface RequestWithCompany extends Request {
  company?: any;
}

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCompany>();
    const token = req.cookies?.['AccessCompanyToken'];
    if (!token) throw new UnauthorizedException('Authentication token missing');

    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      req.company = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
