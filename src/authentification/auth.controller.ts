import { Controller, Post, Body, ValidationPipe, Get, Res, Req } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { Response } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('auth')
export class AuthController {
    private supabase;

  constructor(private readonly authService: AuthentificationService,private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
   }

  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const authResponse = await this.authService.signIn(email, password);
    return authResponse; 
  }

  @Post('session')
  async getSession() {
    return await this.authService.getSession();
  }

  @Get('check-session')
  async checkSession() {
    try {
      const user = await this.authService.getUser();
      if (!user) {
        return { message: 'No user logged in' }; // Aucun utilisateur connecté
      }
      return { message: 'Session is valid', user };
    } catch (error) {
      console.error('Error checking session:', error);
      return { message: 'Failed to fetch user', details: error.message };
    }
  }



  // Route pour la déconnexion
  @Post('sign-out')
  async signOut() {
    await this.authService.signOut();
    return { message: 'Déconnexion réussie' };
  }
  @Post('sign-up')
  async signUp(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      // Appeler la méthode signUp du service AuthService
      const authResponse = await this.authService.signUp(email, password);
      return { message: 'Signup successful', data: authResponse }; // Répondre avec succès
    } catch (error) {
      // Gérer les erreurs éventuelles et répondre avec un message d'erreur
      return { message: error.response.message, details: error.response.details };
    }
  }
  @Get('current-user')
  async getCurrentUser() {
    const user = await this.authService.getUser(); // Passer 'request' à la fonction
    return user || { message: 'No user logged in' };
  }


 
}