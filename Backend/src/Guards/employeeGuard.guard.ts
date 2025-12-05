import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RequestWithEmployee } from '../common/interfaces/employee.interface';

@Injectable()
export class EmployeeJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithEmployee>();
    const employeeToken = this.extractTokenFromCookies(request);

    console.log("Employee's token is:", employeeToken);

    if (!employeeToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const decodedEmployee = await this.jwtService.verifyAsync(employeeToken, {
        secret: process.env.Jwt_SECRET_KEY || 'secretkey',
      });

      request.employee = decodedEmployee;
      return true;
    } catch (error) {
      console.log('Error in employee guard:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromCookies(req: Request): string | undefined {
    return req.cookies?.['AccessEmployeeToken'];
  }
}
