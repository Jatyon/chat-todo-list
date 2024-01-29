import { Module } from '@nestjs/common';
import { TaskService } from '@modules/task/task.service';
import { TaskController } from '@modules/task/task.controller';
import { TaskRepository } from '@modules/task/repositories/task.repository';
import { BoardRepository } from '@modules/board/repositories/board.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, BoardRepository, UserRepository],
  exports: [TaskService],
})
export class TaskModule {}
