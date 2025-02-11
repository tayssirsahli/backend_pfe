import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async chat(@Body('message') message: string) {
    const response = await this.chatbotService.getChatbotResponse(message);
    return { response };
  }
}