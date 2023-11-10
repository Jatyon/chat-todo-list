import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }
}
