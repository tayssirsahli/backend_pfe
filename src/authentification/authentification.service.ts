import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthResponse, User } from '@supabase/supabase-js';
import { Response } from 'express'; // Assurez-vous que cela est bien importé
import axios from 'axios';

@Injectable()
export class AuthentificationService {
  private supabase;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,

    });

    if (error) {
      throw new HttpException(
        { message: 'Sign-in failed', details: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return data;
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new HttpException(
        { message: 'Signup failed', details: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }

    return data;
  }

  async getSession(): Promise<any | null> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      throw new HttpException(
        { message: 'Failed to get session', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data?.session || null;
  }

  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      throw new HttpException(
        { message: 'Sign out failed', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw new HttpException(
        { message: 'Failed to fetch user', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data.user || null;
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



}
