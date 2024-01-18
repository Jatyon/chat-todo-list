import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from '@modules/message/dto/create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
