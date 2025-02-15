import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthentificationService } from './authentification/authentification.service';
import { SupabaseService } from './supabase/supabase.service';
import { ScrapedDataService } from './scraped-data/scraped_data.service';
import { AuthController } from './authentification/auth.controller';
import { ScrapedDataController } from './scraped-data/Scraped-data.Controller';
import { ChatbotModule } from './chatbot/chatbot.module';
import { GeneratedIdeaService } from './generated-idea/generated-idea.service';
import { GeneratedIdeaController } from './generated-idea/generated-idea.controller';
import { LinkedinModule } from './linkedin/linkedin.module';

@Module({
  imports: [ChatbotModule, ConfigModule.forRoot(), LinkedinModule],
  controllers: [AppController, AuthController,ScrapedDataController, GeneratedIdeaController],
  providers: [AppService, AuthentificationService, ScrapedDataService, SupabaseService, GeneratedIdeaService],
})
export class AppModule {}
