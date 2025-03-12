import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    console.log("Authorization Header:", authHeader); // 🔍 Debug

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn("Aucun token JWT trouvé dans l'en-tête Authorization");
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log("JWT Payload:", payload); // 🔍 Debug
      request.user = payload;
      return true;
    } catch (error) {
      console.error("Erreur de validation JWT:", error.message);
      return false;
    }
  }
}
