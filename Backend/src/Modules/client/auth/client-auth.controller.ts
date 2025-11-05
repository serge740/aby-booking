import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ClientService } from './client-auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ClientAuthGuard } from 'src/Guards/client-auth.guard';
import { GoogleAdminStateGuard } from 'src/Guards/google-admin-state.guard';
import { RequestWithClient } from 'src/common/interfaces/client-payload.interface';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ClientFileFields, testimonialUploadConfig } from 'src/common/Utils/file-upload.util';


@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  // -----------------------------
  // REGISTER
  // -----------------------------
  @Post('register')
  async register(
    @Body()
    body: { name: string; email: string; phoneNumber: string; password: string },
  ) {
    return this.clientService.registerClient(body);
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  @Post('login')
  async login(@Body() body: { login: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const { token, client } = await this.clientService.clientLogin(body);

    // Set cookie
    res.cookie('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return { message: 'Login successful', client, token };
  }

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
  @UseGuards(ClientAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: RequestWithClient,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {

    const id = (req.client as any)?.id;

    return this.clientService.changePassword(id, body.currentPassword, body.newPassword);
  }

  // -----------------------------
  // UPDATE CLIENT
  // -----------------------------
  @UseGuards(ClientAuthGuard)
  @Patch('update')
  @UseInterceptors(FileFieldsInterceptor(ClientFileFields, testimonialUploadConfig))
  async updateClient(
    @Req() req: RequestWithClient,
    @Body()
    body: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      profileImage?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    },
    @UploadedFiles() files?: { profileImage?: Express.Multer.File[] },
  ) {
    if (files?.profileImage) {
      body.profileImage = `/uploads/profile/${files?.profileImage?.[0].filename}`
    }
    const clientId = (req.client as any)?.id;
    return this.clientService.updateClient(clientId, body);
  }

  // -----------------------------
  // DELETE CLIENT
  // -----------------------------
  @UseGuards(ClientAuthGuard)
  @Delete('delete')
  async deleteClient(@Req() req: RequestWithClient) {
    const id = (req.client as any)?.id;
    return this.clientService.deleteClient(id);
  }

  // -----------------------------
  // 🔐 GET CLIENT PROFILE
  // -----------------------------
  @UseGuards(ClientAuthGuard)
  @Get('profile')

  async getProfile(@Req() req: RequestWithClient) {
    // The guard attaches decoded user info to req.user

    const clientId = (req.client as any)?.id;
    const client = await this.clientService.getClientProfile(clientId);
    return { client };
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  @UseGuards(ClientAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response, @Req() req: RequestWithClient) {
    const clientId = (req.client as any)?.id;
    await this.clientService.logout(res, clientId);

  }

  // -----------------------------
  // GOOGLE OAUTH LOGIN
  // -----------------------------
  @Get('google')
  @UseGuards(GoogleAdminStateGuard, AuthGuard('google-client'))
  async googleLogin() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-client'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { client, token, redirect, state } = req.user as any;
    console.log(req.user);
    

    if (redirect) {
      // Redirect to frontend if OAuth failed
      return res.redirect(redirect);
    }

    // Set cookie
    res.cookie('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const platform = state.platform;



    let redirectUri;

    if (platform == 'mobile' || platform == 'window') {
      redirectUri = (state.redirectUri as string);
    }
    else if (platform == 'web') {
      redirectUri = `${process.env.FRONTEND_URL}/${state.path}`
    }
    else{
      redirectUri = `${process.env.FRONTEND_URL}`
    }
    // Redirect to frontend or return client info
    return res.redirect(`${redirectUri}?login=success&token=${token}`);
  }
}
