import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Message } from '@modules/message/entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }
}
