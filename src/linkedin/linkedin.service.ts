import { Get, Headers, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LinkedinService {
  async postToLinkedIn(accessToken: string, content: string) {
    try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: `urn:li:person:VD16EZQ1h_`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
           'LinkedIn-Version': '202401',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
 catch (error) {
    console.error('Erreur LinkedIn API:', error.response?.data || error.message);
    throw new Error('Erreur lors de la publication sur LinkedIn');
  }


  
}}
