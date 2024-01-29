import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '@modules/board/entities/board.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  getBoardByUser(userId: number): Promise<Board[]> {
    return this.createQueryBuilder('board')
      .innerJoin('board.board_users', 'board_users')
      .select(['board.id', 'board.name', 'board.shared'])
      .where('board_users.user_id= :userId', { userId })
      .getMany();
  }
}
