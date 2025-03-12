import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { GeneratedIdeaService } from './generated-idea.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GeneratedIdeaDto } from 'src/dto/generated-idea_dto';

@Controller('generated-idea')
export class GeneratedIdeaController {
    constructor(private readonly generatedIdeaService: GeneratedIdeaService) {
        if (!generatedIdeaService) {
            throw new Error("GeneratedIdeaService is not initialized");
        }
    }

    @Post('add')
    async create(@Body() body: GeneratedIdeaDto) {
        if (!body.user_id || !body.generated_text) {
            return { error: 'Missing user_id or generated_text' };
        }
        return await this.generatedIdeaService.createGeneratedIdea(body);
    }

    @Get()
    async getAll() {
        return await this.generatedIdeaService.getGeneratedIdeas();
    }

    @Get('count')
    async getCount(): Promise<number> {
        return this.generatedIdeaService.count();
    }

    @Post('upload-media')
    @UseInterceptors(FilesInterceptor('media', 10))
    async uploadMedia(@UploadedFiles() files: Express.Multer.File[]) {
      const urls = await Promise.all(files.map((file) => this.generatedIdeaService.uploadFile(file)));
      return { urls };
    }
    @Get('count-by-month')
    async getIdeasByMonth() {
        return await this.generatedIdeaService.countByMonth();
    }
}


