import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from '@modules/chat/dto/create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  id: number;
}
