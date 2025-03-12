import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'; 
import * as path from 'path';  // Assure-toi d'importer path
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
  
  // Utiliser useStaticAssets pour les fichiers statiques
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Optionnel : définit le préfixe d'URL pour les fichiers statiques
  });

  app.enableCors({
    origin: [

      'http://localhost:3000',
      'https://www.linkedin.com',
      'https://www.facebook.com',
      'chrome-extension://leegmmjaiokdippfaoifelkgnchjgaeb',
      'http://localhost:5000',
      'http://localhost:5174',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Autoriser les méthodes nécessaires
    credentials: true,  // Si tu veux autoriser les cookies/session
  });
  app.use(cookieParser()); // Middleware pour lire les cookies
  

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
