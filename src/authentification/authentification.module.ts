import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/guard/JwtStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        }),
        inject: [ConfigService],
      }),
  ],
  providers: [AuthentificationService, JwtStrategy, PrismaService],
  exports: [AuthentificationService,JwtModule],
  controllers: [AuthController],
})
@Module({})
export class AuthentificationModule {}
