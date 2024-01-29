import { Module } from '@nestjs/common';
import { ChatService } from '@modules/chat/chat.service';
import { ChatGateway } from '@modules/chat/chat.gateway';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';

@Module({
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
