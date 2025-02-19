import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LinkedinService {
    async uploadImageToLinkedIn(accessToken: string): Promise<{ assetUrn: string; uploadUrl: string }> {
        try {
            const uploadResponse = await axios.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        owner: `urn:li:person:VD16EZQ1h_`, // Remplace par ton urn
                        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
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

            console.log('✅ Upload URL LinkedIn:', uploadUrl);

            return { assetUrn, uploadUrl };
        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement de l'upload:", error.response?.data || error.message);
            throw new Error("Impossible d'obtenir l'URL de téléchargement pour l'image.");
        }
    }

    async postToLinkedIn(accessToken: string, content: string, imagePath?: string) {
        try {
            let media: { status: string; media: string }[] = [];

            if (imagePath) {
                console.log('📂 Image reçue:', imagePath);

                // 📌 Convertir le chemin en URL publique si besoin
                if (!imagePath.startsWith('http')) {
                    imagePath = `http://localhost:5000/uploads/${path.basename(imagePath)}`;
                }

                console.log('🌍 URL publique:', imagePath);

                // ✅ Vérifier si le fichier existe
                const localPath = path.join(__dirname, '..', '..','uploads', path.basename(imagePath));
                if (!fs.existsSync(localPath)) {
                    throw new Error(`❌ Fichier introuvable: ${localPath}`);
                }

                // 1️⃣ Obtenir une URL d’upload LinkedIn
                const { assetUrn, uploadUrl } = await this.uploadImageToLinkedIn(accessToken);

                // 2️⃣ Lire et envoyer l’image à LinkedIn
                const image = fs.readFileSync(localPath);
                await axios.put(uploadUrl, image, {
                    headers: { 'Content-Type': 'image/png' },
                });

                // 3️⃣ Ajouter l’image à la publication
                media.push({
                    status: "READY",
                    media: assetUrn,
                });
            }

            // 4️⃣ Publier le post
            const response = await axios.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: `urn:li:person:VD16EZQ1h_`,  // Remplace par ton urn
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: { text: content },
                            shareMediaCategory: imagePath ? 'IMAGE' : 'NONE',
                            media: media
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
                }
            );

            console.log('✅ Post publié sur LinkedIn !');

            return response.data;
        } catch (error) {
            console.error('❌ Erreur LinkedIn API:', error.response?.data || error.message);
            throw new Error('Erreur lors de la publication sur LinkedIn');
        }
    }
}
