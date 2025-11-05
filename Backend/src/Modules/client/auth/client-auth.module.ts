import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientService } from './client-auth.service';
import { ClientController } from './client-auth.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { ClientAuthGuard } from 'src/Guards/client-auth.guard';
import { GoogleClientStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey', // 🔑 replace in production
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    PrismaService,
    GoogleClientStrategy,
    ClientAuthGuard,
  ],
  exports: [ClientService],
})
export class ClientAuthModule {}
