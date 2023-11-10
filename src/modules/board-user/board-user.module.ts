import { Module } from '@nestjs/common';
import { BoardUserService } from './board-user.service';
import { BoardUserController } from './board-user.controller';

@Module({
  controllers: [BoardUserController],
  providers: [BoardUserService],
})
export class BoardUserModule {}
