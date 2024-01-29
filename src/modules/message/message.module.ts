import { Module } from '@nestjs/common';
import { MessageService } from '@modules/message/message.service';
import { MessageController } from '@modules/message/message.controller';
import { MessageRepository } from '@modules/message/repositories/message.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
