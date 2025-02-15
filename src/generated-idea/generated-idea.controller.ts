import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GeneratedIdeaService } from './generated-idea.service';

@Controller('generated-idea')
export class GeneratedIdeaController {
    constructor(private readonly generatedIdeaService: GeneratedIdeaService) { }

    @Post('add')
    async create(@Body() body: { user_id: string; generated_text: string }) {
        if (!body.user_id || !body.generated_text) {
            return { error: 'Missing user_id or generated_text' };
        }
        return await this.generatedIdeaService.createGeneratedIdea(body.user_id, body.generated_text);
    }

    @Get()
    async getAll() {
        return await this.generatedIdeaService.getGeneratedIdeas();
    }

    @Get('count')
    async getCount(): Promise<number> {
        return this.generatedIdeaService.count();
    }
}
