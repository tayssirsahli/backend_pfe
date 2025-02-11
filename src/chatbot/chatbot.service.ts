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
          model: 'llama3-8b-8192', // Modèle rapide et efficace
          messages: [{ role: 'user', content: message }],
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