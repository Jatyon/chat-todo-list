import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardRepository } from './repositories/board.repository';
import { BoardUserRepository } from '../board-user/repositories/board-user.repository';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardUserRepository, UserRepository],
})
export class BoardModule {}
