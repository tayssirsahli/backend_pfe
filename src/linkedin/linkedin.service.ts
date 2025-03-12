import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LinkedinService {
    async uploadMediaToLinkedIn(accessToken: string, userId: string, mediaType: 'image' | 'video'): Promise<{ assetUrn: string; uploadUrl: string }> {
        const recipe = mediaType === 'image' ? 'urn:li:digitalmediaRecipe:feedshare-image' : 'urn:li:digitalmediaRecipe:feedshare-video';
        try {
            const uploadResponse = await axios.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        owner: `urn:li:person:${userId}`,
                        recipes: [recipe],
                        serviceRelationships: [
                            {
                                relationshipType: "OWNER",
                                identifier: "urn:li:userGeneratedContent",
                            },
                        ],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'LinkedIn-Version': '202401',
                        'Content-Type': 'application/json',
                    },
                }
            );

            const assetUrn = uploadResponse.data.value.asset;
            const uploadUrl = uploadResponse.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;

            return { assetUrn, uploadUrl };
        } catch (error) {
            console.error("❌ Erreur upload media:", error.response?.data || error.message);
            throw new Error("Erreur lors de l'obtention de l'URL de téléchargement du média.");
        }
    }

    
        async postToLinkedIn(accessToken: string, userId: string, content: string, mediaPaths: string[]) {
            try {
                let mediaAssets: { status: string; media: string; isVideo: boolean }[] = [];
        
                // 🚨 Cas où il y a des médias
                for (const mediaPath of mediaPaths) {
                    const isVideo = !!mediaPath.match(/\.(mp4|webm|ogg)$/i);
                    const mediaType = isVideo ? 'video' : 'image';
        
                    const { assetUrn, uploadUrl } = await this.uploadMediaToLinkedIn(accessToken, userId, mediaType);
                    const localPath = path.join(__dirname, '..', '..', 'uploads', path.basename(mediaPath));
        
                    if (!fs.existsSync(localPath)) throw new Error(`❌ Fichier introuvable: ${localPath}`);
        
                    const mediaFile = fs.readFileSync(localPath);
                    await axios.put(uploadUrl, mediaFile, {
                        headers: { 'Content-Type': isVideo ? 'video/mp4' : 'image/png' },
                    });
        
                    mediaAssets.push({ status: "READY", media: assetUrn, isVideo });
                }
        
                // ✅ 🚨 Si aucun média -> Post texte uniquement
                const postBody = mediaAssets.length === 0
                    ? {
                        author: `urn:li:person:${userId}`,
                        lifecycleState: 'PUBLISHED',
                        specificContent: {
                            'com.linkedin.ugc.ShareContent': {
                                shareCommentary: { text: content },
                                shareMediaCategory: 'NONE', // ✅ Important pour les posts texte uniquement
                            },
                        },
                        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
                    }
                    : {
                        author: `urn:li:person:${userId}`,
                        lifecycleState: 'PUBLISHED',
                        specificContent: {
                            'com.linkedin.ugc.ShareContent': {
                                shareCommentary: { text: content },
                                shareMediaCategory: mediaAssets.some(asset => asset.isVideo) ? 'VIDEO' : 'IMAGE',
                                media: mediaAssets.map(asset => ({
                                    status: "READY",
                                    description: { text: content },
                                    media: asset.media,
                                    title: { text: asset.isVideo ? "Vidéo partagée" : "Image partagée" },
                                })),
                            },
                        },
                        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
                    };
        
                const response = await axios.post(
                    'https://api.linkedin.com/v2/ugcPosts',
                    postBody,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'X-Restli-Protocol-Version': '2.0.0',
                            'LinkedIn-Version': '202401',
                            'Content-Type': 'application/json',
                        },
                    }
                );
        
                return response.data;
            } catch (error) {
                console.error('❌ Erreur LinkedIn API:', error.response?.data || error.message);
                throw new Error('Erreur lors de la publication sur LinkedIn');
            }
        }
        

        async getPosts(accessToken: string) {
            try {
              const response = await axios.get('https://api.linkedin.com/v2/ugcPosts', {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              });
        
              return response.data;
            } catch (error) {
              console.error('Error fetching LinkedIn posts:', error);
              throw new Error('Failed to fetch LinkedIn posts');
            }
          }
}
