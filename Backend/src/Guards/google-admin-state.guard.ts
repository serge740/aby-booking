// guards/google-admin-state.guard.ts
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class GoogleAdminStateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const state = request.query.state;
   
    console.log('Guard - state received:', state);
   
    // Store state in cookie before OAuth redirect
    if (state) {
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        maxAge: 5 * 60 * 1000,
        path: '/',
      };
     
      response.cookie('oauth_state', state, cookieOptions);
      console.log('Guard - storing state in cookie:', state);
    }
   
    // Return true to continue to next guard
    return true;
  }
}