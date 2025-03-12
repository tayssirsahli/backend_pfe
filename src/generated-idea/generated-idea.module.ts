import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GeneratedIdeaController } from './generated-idea.controller';
import { GeneratedIdeaService } from './generated-idea.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [
        MulterModule.register({
          dest: './uploads', // Répertoire où les images seront stockées
        }),SupabaseModule
      ],
      controllers: [GeneratedIdeaController],
      providers: [GeneratedIdeaService,PrismaService],
      exports: [GeneratedIdeaService],  
})
export class GeneratedIdeaModule {}
