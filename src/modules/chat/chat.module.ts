import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  providers: [ChatGateway, ChatService, ChatRepository],
})
export class ChatModule {}
