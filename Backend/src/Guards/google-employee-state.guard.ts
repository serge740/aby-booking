import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class GoogleEmployeeStateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const state = request.query.state;

    console.log('Employee Guard - state received:', state);

    if (state) {
      const cookieOptions = {
        httpOnly: true,
        secure: false, // set true in production
        sameSite: 'lax' as const,
        maxAge: 5 * 60 * 1000,
        path: '/',
      };

      response.cookie('oauth_state', state, cookieOptions);
      console.log('Employee Guard - storing state in cookie:', state);
    }

    return true;
  }
}
