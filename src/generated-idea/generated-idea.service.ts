import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { GeneratedIdeaDto } from 'src/dto/generated-idea_dto';

@Injectable()
export class GeneratedIdeaService {
    constructor(private readonly prisma: PrismaService) {}

    async createGeneratedIdea(generatedIdeaDto: GeneratedIdeaDto) {
        return await this.prisma.generated_idea.create({
            data: generatedIdeaDto,
        });
    }

    async getGeneratedIdeas() {
        return await this.prisma.generated_idea.findMany();
    }

    async count(): Promise<number> {
        return await this.prisma.generated_idea.count();
    }

    private readonly uploadDir = path.join(__dirname, '../../uploads');

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
        const fileName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/${fileName}`;
    }

    async countByMonth(): Promise<any[]> {
        const ideas = await this.prisma.generated_idea.findMany({
            select: { created_at: true },
            orderBy: { created_at: 'asc' },
        });

        const groupedByMonth = ideas.reduce((acc, item) => {
            const month = new Date(item.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groupedByMonth).map(([month, count]) => ({ month, count }));
    }
}
