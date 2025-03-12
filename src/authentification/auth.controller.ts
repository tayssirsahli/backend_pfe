import { Controller, Post, Body, ValidationPipe, Get, Res, Req, Query, Redirect, Put, UseGuards, Request } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { UserDto } from '../dto/user_dto';
import { JwtAuthGuard } from 'src/guard/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthentificationService) { }

  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }, @Res() res) {
    const { email, password } = body;
    const authResponse = await this.authService.signIn(email, password, res);
    return authResponse;
  }



  @Get('session')
  async getSession() {
    const session = await this.authService.getSession();
    return session || { message: 'Session not found' };
  }


  @Post('sign-out')
  async signOut(@Res() res) {
    return this.authService.signOut(res);
  }

  @Post('sign-up')
  async signUp(@Body(ValidationPipe) userDto: UserDto) {
    const authResponse = await this.authService.signUp(userDto);
    return { message: 'Signup successful', data: authResponse };
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req): Promise<any> {
    console.log("User in request:", req.user);
    const user = await this.authService.getUser(req);
    return user || { message: 'No user logged in' };
  }

  @Get('linkedin')
  @Redirect()
  async redirectToLinkedIn() {
    return { url: this.authService.getLinkedInAuthUrl() };
  }

  @Get('linkedin/callback')
  async handleLinkedInCallback(@Query('code') code: string, @Res() res) {
    const accessToken = await this.authService.getAccessToken(code);
    res.redirect(`http://localhost:5174?token=${accessToken}`);
  }

  @Put('update-profile')
  async updateProfile(@Body(ValidationPipe) userDto: UserDto) {
    return await this.authService.updateUser(userDto);
  }
}
