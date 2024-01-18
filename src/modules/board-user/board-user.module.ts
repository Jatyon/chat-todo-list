import { Module } from '@nestjs/common';
import { BoardUserService } from '@modules/board-user/board-user.service';
import { BoardUserController } from '@modules/board-user/board-user.controller';

@Module({
  controllers: [BoardUserController],
  providers: [BoardUserService],
})
export class BoardUserModule {}
