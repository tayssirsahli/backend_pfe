import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Importez PrismaService
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDto } from '../dto/user_dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthentificationService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

  async signIn(email: string, password: string, res: Response): Promise<any> {
    console.time("Prisma findUnique");
    const user = await this.prismaService.users.findUnique({
      where: { email: email },
    });
    console.log(user);
    console.timeEnd("Prisma findUnique");

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    console.time("Bcrypt compare");
    const isPasswordValid = await bcrypt.compare(password, user.encrypted_password);
    console.timeEnd("Bcrypt compare");

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    console.time("JWT Sign");

    const payload = { id: user.id, email: user.email };
    console.log('Creating JWT...');

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    console.log('JWT Created:', access_token);

    console.timeEnd("JWT Sign");

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    const Session = await this.prismaService.sessions.create({
      data: {
        user_id: user.id,
        access_token: access_token, // Stockage de l'access_token
        created_at: new Date(),
        not_after: new Date(new Date().getTime() + 3600000), // 1 heure d'expiration
      },
    });
    console.log('session', Session);

    return res.json({
      user,
      session: { access_token }
    });
  }

  async signUp(userDto: UserDto): Promise<any> {

    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    try {
      const user = await this.prismaService.users.create({
        data: {
          email: userDto.email,
          encrypted_password: hashedPassword,
          raw_user_meta_data: {
            username: userDto.username,
            phone: userDto.phone,
            location: userDto.location,
            avatar_url: userDto.avatar_url,
          },
        },
      });
      return { user };
    } catch (error) {
      throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST);
    }
  }


  async getSession(): Promise<any> {
    const session = this.prismaService.sessions.findFirst();
    //console.log("Session:", session);
    return session;
  }

  async signOut(res: Response): Promise<any> {
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: 'Déconnexion réussie' });
  }
  async getUser(request: any): Promise<any> {
    console.log("User in request:", request.user);
    const userId = request.user?.id;
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    const user = this.prismaService.users.findUnique({
      where: { id: userId },
    });
    console.log("User in request:", user);

    return user;
  }

  async updateUser(userDto: UserDto): Promise<any> {
    // Hash the password if it's provided
    const hashedPassword = userDto.password ? await bcrypt.hash(userDto.password, 10) : undefined;

    try {
      const updatedUser = await this.prismaService.users.update({
        where: { email: userDto.email },
        data: {
          encrypted_password: hashedPassword,
          raw_user_meta_data: {
            username: userDto.username,
            phone: userDto.phone,
            location: userDto.location,
            avatar_url: userDto.avatar_url,
          }
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  getLinkedInAuthUrl(): string {
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid profile email w_member_social`;
  }

  async getAccessToken(code: string): Promise<string> {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      },
    });
    return response.data.access_token;
  }

  async getUserById(userId: string): Promise<any> {
    return this.prismaService.users.findUnique({ where: { id: userId } });
  }
}
