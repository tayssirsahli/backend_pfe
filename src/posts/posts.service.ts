import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from 'src/dto/posts_dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async add(postData: PostDto) {
        console.log(postData);
        console.log(postData.temps);
        return await this.prisma.posts.create({
            data: {
                content: postData.content,
                urls: postData.urls,
                date: postData.date,
                temps: postData.temps,
                user_id: postData.user_id,
                joints_urls: postData.joints_urls,
                etat: 'planifer', // Valeur par défaut si nécessaire
            },
        });
    }

    async getAllPosts() {
        return await this.prisma.posts.findMany({
            where: { etat: 'planifer' },
        });
    }

    async updatePostState(id: string, state: 'publier' | 'planifer' | 'Annuler' ) {
        return await this.prisma.posts.update({
            where: { id },
            data: { etat: state },
        });
    }
}