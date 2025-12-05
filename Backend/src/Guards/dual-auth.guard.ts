import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface RequestWithCompanyEmployee extends Request {
  company?: any;
  employee?: any;
}

@Injectable()
export class DualAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCompanyEmployee>();

    // 1️⃣ Check company token
    const companyToken = req.cookies?.['AccessCompanyToken'];
    if (companyToken) {
      try {
        const decodedCompany = await this.jwtService.verifyAsync(companyToken, {
          secret: process.env.JWT_SECRET || 'secretkey',
        });
        req.company = decodedCompany;
       
      } catch (err) {
        console.log('Invalid company token:', err);
      }
    }

    // 2️⃣ Check employee token if no valid company token
    const employeeToken = req.cookies?.['AccessEmployeeToken'];
    if (employeeToken) {
      try {
        const decodedEmployee = await this.jwtService.verifyAsync(employeeToken, {
          secret: process.env.Jwt_SECRET_KEY || 'secretkey',
        });
       
        
        req.employee = decodedEmployee;
        
      } catch (err) {
        console.log('Invalid employee token:', err);
      }
    }
    
    return true;
    // 3️⃣ Neither company nor employee authenticated
    throw new UnauthorizedException('You do not have permission to access this resource');
  }
}
