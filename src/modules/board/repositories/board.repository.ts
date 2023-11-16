import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  getBoardByUser(userId: number): Promise<Board[]> {
    return this.createQueryBuilder('board')
      .innerJoin('board.board_users', 'board_users')
      .select(['board.name'])
      .where('board_users= :userId', { userId })
      .getMany();
  }


}
