import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from '@modules/chat/chat.service';
import { CreateChatDto } from '@modules/chat/dto/create-chat.dto';
import { UpdateChatDto } from '@modules/chat/dto/update-chat.dto';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('create:chat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('find:all:chat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('find:one:chat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('update:chat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('remove:chat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
