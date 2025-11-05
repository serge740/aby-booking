import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt  from 'bcryptjs'
import { randomBytes } from 'crypto';

interface OAuthState {
  redirectUri?: string;
  popup?: boolean;
  [key: string]: any;
}

@Injectable()
export class GoogleClientStrategy extends PassportStrategy(
  Strategy,
  'google-client',
) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: process.env.CLIENT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.CLIENT_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CLIENT_GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: { id: string; displayName?: string; emails: { value: string }[] },
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, displayName } = profile;
      const userEmail = emails[0].value;

      // Retrieve state from cookies
      const stateCookie = req.cookies?.oauth_state;
      let parsedState: OAuthState = {};

      if (stateCookie) {
        try {
          parsedState =
            typeof stateCookie === 'string'
              ? JSON.parse(decodeURIComponent(stateCookie))
              : stateCookie;
        } catch (err) {
          console.error('Failed to parse OAuth state:', err);
        }
      }

      // If no Google ID, redirect
      if (!id) {
        const redirectUrl = parsedState.redirectUri
          ? `${parsedState.redirectUri}&status=notfound&acceptance=0`
          : `${process.env.FRONTEND_URL_ONLY}/auth/client/login?status=notfound&&acceptance=0`;

        return done(null, { redirect: redirectUrl, state: parsedState });
      }

      // Find client by google_id
      let client = await this.prisma.client.findFirst({ where: { google_id: id } });

      // If client exists, make sure name is set
      if (client) {
        if (!client.name && displayName) {
          client = await this.prisma.client.update({
            where: { id: client.id },
            data: { name: displayName },
          });
        }

        const token = this.jwtService.sign({ id: client.id, role: 'client' });
        return done(null, { client, token, state: parsedState });
      }

      // Try finding client by email
      client = await this.prisma.client.findUnique({ where: { email: userEmail } });
      
      if (!client) {
          const randomPassword = await bcrypt.hash(randomBytes(16).toString('hex'), 10);
          // New client: create with name
        client = await this.prisma.client.create({
          data: {
            name: displayName || 'No Name',
            email: userEmail,
            google_id: id,
            password:randomPassword,
            status: 'ACTIVE',
          },
        });
      } else if (!client.google_id) {
        // Link Google ID and set name if missing
        client = await this.prisma.client.update({
          where: { id: client.id },
          data: {
            google_id: id,
            name: client.name || displayName || 'No Name',
          },
        });
      }

      // Issue JWT
      const token = this.jwtService.sign({ id: client.id, role: 'client' });
      return done(null, { client, token, state: parsedState });
    } catch (error) {
      console.error('Google Client Strategy Error:', error);
      done(error, null);
    }
  }
}
