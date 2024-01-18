import { Module, forwardRef } from '@nestjs/common';
import { BoardService } from '@modules/board/board.service';
import { BoardController } from '@modules/board/board.controller';
import { BoardRepository } from '@modules/board/repositories/board.repository';
import { BoardUserRepository } from '@modules/board-user/repositories/board-user.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { JwtStrategy } from '@modules/auth//strategies/jwt.strategy';
import { OwnerBoardStrategy } from '@modules/auth/strategies/owner-board.strategy';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardUserRepository, UserRepository, JwtStrategy, OwnerBoardStrategy],
  exports: [BoardService],
})
export class BoardModule {}
