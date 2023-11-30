import { Module, forwardRef } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardRepository } from './repositories/board.repository';
import { BoardUserRepository } from '../board-user/repositories/board-user.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { JwtStrategy } from '../auth//strategies/jwt.strategy';
import { OwnerBoardStrategy } from '../auth/strategies/owner-board.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardUserRepository, UserRepository, JwtStrategy, OwnerBoardStrategy],
  exports: [BoardService],
})
export class BoardModule {}
