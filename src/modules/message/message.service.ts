import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from '@modules/message/dto/create-message.dto';
import { UpdateMessageDto } from '@modules/message/dto/update-message.dto';
import { MessageRepository } from '@modules/message/repositories/message.repository';
import { Message } from '@modules/message/entities/message.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getMessages(chatId: number): Promise<Message[]> {
    return this.messageRepository.findBy({ chat_id: chatId });
  }

  async saveMessage(chatId: number, boardId: number, email: string, content: string): Promise<Message> {
    const findUser: User = await this.userRepository.getUserByBoard(boardId, email);

    if (findUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    const newMessage: Message = new Message();
    newMessage.chat_id = chatId;
    newMessage.user_id = findUser.id;
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
