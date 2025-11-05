import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    let token: string | undefined;

 
    
    // 1️⃣ Try to get token from Authorization header (Bearer token)

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log(authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2️⃣ Fallback: get token from cookies
    if (!token && req.cookies?.client_token) {
      token = req.cookies.client_token;
    }

    // 3️⃣ No token found
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    // 4️⃣ Verify token
    try {
     const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      if (decoded.role !== 'client') {
        throw new UnauthorizedException('Invalid token role');
      }
      req.client = decoded; // Attach client payload to the request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
