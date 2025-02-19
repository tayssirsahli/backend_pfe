import { Controller, Post, Body, Headers, UnauthorizedException, Get } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import axios from 'axios';

@Controller('linkedin')
export class LinkedinController {
    constructor(private readonly linkedinService: LinkedinService) { }

    @Post('post')
    async postToLinkedIn(
      @Body() body: { content: string; imageUrl?: string },
      @Headers('authorization') authHeader: string
    ) {
      const accessToken = authHeader?.replace('Bearer ', '');
      if (!accessToken) throw new UnauthorizedException('Token manquant');
    
      return this.linkedinService.postToLinkedIn(accessToken, body.content, body.imageUrl);
    }
    


    @Get('profile')
    async getLinkedInProfile(@Headers('authorization') authHeader: string) {
        //console.log("Authorization header reçu :", authHeader);

        const accessToken = authHeader?.replace('Bearer ', '');
        if (!accessToken) {
            console.error("Token manquant !");
            throw new UnauthorizedException('Token manquant');
        }

        try {
            const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Erreur API LinkedIn :", error.response?.data || error.message);
            throw new UnauthorizedException(error.response?.data || 'Impossible de récupérer le profil');
        }
    }

}


