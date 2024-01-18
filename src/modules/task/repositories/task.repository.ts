import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from '@modules/task/entities/task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
}
