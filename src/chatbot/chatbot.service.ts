import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  private readonly apiKey = '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';
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  async getChatbotResponse(message: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama3-8b-8192',
          messages: [
            { 
              role: 'system', 
              content: "Tu es un assistant spécialisé en communication professionnelle. Reformule les phrases de manière claire, concise et élégante, en adoptant un ton formel et adapté au monde de l'entreprise. Ne fais pas d'introduction, donne uniquement la reformulation." 
            },
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur Groq:', error.response?.data || error.message);
      throw new InternalServerErrorException('Erreur lors de la communication avec Groq');
    }
  }
}
