import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', , 'chrome-extension://leegmmjaiokdippfaoifelkgnchjgaeb' ,'http://localhost:5000','http://localhost:5174'   ],
    // // Autoriser uniquement ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Autoriser les méthodes nécessaires
    credentials: true,  // Si tu veux autoriser les cookies/session
  });

  await app.listen(process.env.PORT ?? 5000);

}
bootstrap();


