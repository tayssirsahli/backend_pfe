import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GeneratedIdeaController } from './generated-idea.controller';
import { GeneratedIdeaService } from './generated-idea.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
    imports: [
        MulterModule.register({
          dest: './uploads', // Répertoire où les images seront stockées
        }),SupabaseModule
      ],
      controllers: [GeneratedIdeaController],
      providers: [GeneratedIdeaService],
      exports: [GeneratedIdeaService],  
})
export class GeneratedIdeaModule {}
