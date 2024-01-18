import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BoardUser } from '@modules/board-user/entities/board-user.entity';

@Injectable()
export class BoardUserRepository extends Repository<BoardUser> {
  constructor(private dataSource: DataSource) {
    super(BoardUser, dataSource.createEntityManager());
  }
}
