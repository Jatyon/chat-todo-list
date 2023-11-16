import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './repositories/task.repository';
import { BoardRepository } from '../board/repositories/board.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, BoardRepository],
})
export class TaskModule {}
