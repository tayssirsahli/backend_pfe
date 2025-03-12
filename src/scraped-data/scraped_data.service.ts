import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScrapedDataDto } from 'src/dto/scraped-data_dto';

@Injectable()
export class ScrapedDataService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllScrapedData() {
        return this.prisma.scraped_data.findMany();
    }

    async getScrapedDataById(id: string) {
        return this.prisma.scraped_data.findUnique({ where: { id } });
    }

    async addScrapedData(newData: ScrapedDataDto[]) {
        const validData = newData.map(data => ({ ...data, id_user: data.id_user?.toString() }));
        return this.prisma.scraped_data.createMany({ data: validData });
    }

    async updateScrapedData(id: string, updatedData: Partial<ScrapedDataDto>) {
        const validData = { ...updatedData, id_user: updatedData.id_user?.toString() };
        return this.prisma.scraped_data.update({ where: { id }, data: validData });
    }

    async deleteScrapedData(id: string) {
        return this.prisma.scraped_data.delete({ where: { id } });
    }

    async getScrapedDataByAuthor(author: string) {
        return this.prisma.scraped_data.findMany({ where: { author } });
    }

    async getScrapedDataSorted() {
        return this.prisma.scraped_data.findMany({ orderBy: { created_at: 'desc' } });
    }

    async count(): Promise<number> {
        return this.prisma.scraped_data.count();
    }
}
