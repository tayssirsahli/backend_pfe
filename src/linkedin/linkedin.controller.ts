import { Controller, Post, Body, Headers, UnauthorizedException, Get, Query } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import axios from 'axios';

@Controller('linkedin')
export class LinkedinController {
    constructor(private readonly linkedinService: LinkedinService) { }

    @Post('post')
    async postToLinkedIn(
        @Body() body: { userId: string; content: string; mediaUrls: string[] },
        @Headers('authorization') authHeader: string
    ) {
        const accessToken = authHeader?.replace('Bearer ', '');
        if (!accessToken) throw new UnauthorizedException('Token manquant');

        return this.linkedinService.postToLinkedIn(accessToken, body.userId, body.content, body.mediaUrls);
    }

    @Get('profile')
    async getLinkedInProfile(@Headers('authorization') authHeader: string) {
        const accessToken = authHeader?.replace('Bearer ', '');
        if (!accessToken) throw new UnauthorizedException('Token manquant');

        try {
            const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                },
            });
            return response.data;
        } catch (error) {
            throw new UnauthorizedException(error.response?.data || 'Erreur récupération profil');
        }
    }

    @Get('posts')
  async getPosts(@Query('accessToken') accessToken: string) {
    return this.linkedinService.getPosts(accessToken);
  }
}