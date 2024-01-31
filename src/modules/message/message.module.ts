import { Module } from '@nestjs/common';
import { MessageService } from '@modules/message/message.service';
import { MessageController } from '@modules/message/message.controller';
import { MessageRepository } from '@modules/message/repositories/message.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, UserRepository],
  exports: [MessageService],
})
export class MessageModule {}
