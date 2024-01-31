import { Module, forwardRef } from '@nestjs/common';
import { BoardService } from '@modules/board/board.service';
import { BoardController } from '@modules/board/board.controller';
import { BoardRepository } from '@modules/board/repositories/board.repository';
import { BoardUserRepository } from '@modules/board-user/repositories/board-user.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { JwtStrategy } from '@modules/auth//strategies/jwt.strategy';
import { OwnerBoardStrategy } from '@modules/auth/strategies/owner-board.strategy';
import { AuthModule } from '@modules/auth/auth.module';
import { BoardGateway } from './board.gateway';

import { TaskModule } from '@modules/task/task.module';
import { MessageModule } from '@modules/message/message.module';
import { ChatModule } from '@modules/chat/chat.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TaskModule, MessageModule, ChatModule, UserModule, forwardRef(() => AuthModule)],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardGateway, BoardUserRepository, UserRepository, JwtStrategy, OwnerBoardStrategy],
  exports: [BoardService],
})
export class BoardModule {}
