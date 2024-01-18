import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '@modules/message/dto/create-message.dto';
import { UpdateMessageDto } from '@modules/message/dto/update-message.dto';
import { MessageRepository } from '@modules/message/repositories/message.repository';
import { Message } from '@modules/message/entities/message.entity';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async getMessages(chat_id: number): Promise<Message[]> {
    return this.messageRepository.findBy({ chat_id });
  }

  async saveMessage(chat_id: number, user_id: number, content: string): Promise<Message> {
    const newMessage: Message = new Message();
    newMessage.chat_id = chat_id;
    newMessage.user_id = user_id;
    newMessage.content = content;

    return await this.messageRepository.save(newMessage);
  }

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
