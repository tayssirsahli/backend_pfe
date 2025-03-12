import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies['access_token'], // Extraire le token du cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Clé secrète pour signer et vérifier le JWT
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email }; // Renvoyer l'utilisateur à partir du payload
  }
}
