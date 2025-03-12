import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from 'src/dto/posts_dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('add')
  async addPost(@Body() postData: PostDto) {
    return this.postsService.add(postData);
  }


  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }


  @Put(':id')
  async updatePostState(@Param('id') id: string, @Body() body: { etat: 'planifer' | 'publier' | 'Annuler' }) {
    return this.postsService.updatePostState(id, body.etat);
  }
}
