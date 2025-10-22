import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithAdmin } from '../common/interfaces/request-admin.interface';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithAdmin>();
    const token = req.cookies?.['AccessAdminToken'];
    if (!token) throw new UnauthorizedException('Authentication token missing');

 try {
  const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
  console.log('JWT verified OK:', decoded);
  req.admin = decoded;
  return true;
} catch (err) {
  console.error('JWT verify failed:', err.message);
  console.log('Decoded without verify:', this.jwtService.decode(token));
  throw new UnauthorizedException('Invalid or expired token');
}

  }
}
