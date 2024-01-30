import { Injectable } from '@nestjs/common';
import { CreateChatDto } from '@modules/chat/dto/create-chat.dto';
import { UpdateChatDto } from '@modules/chat/dto/update-chat.dto';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';
import { Chat } from '@modules/chat/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getChatByToken(token: string): Promise<Chat> {
    return this.chatRepository.findOneBy({ token });
  }

  async getChatByBoard(boardId: number): Promise<Chat> {
    return this.chatRepository.findOneBy({ board_id: boardId });
  }

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
