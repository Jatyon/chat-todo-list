import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { BoardRepository } from '../board/repositories/board.repository';
import { Board } from '../board/entities/board.entity';
import { Task } from './entities/task.entity';
import { TaskCategory } from './enums/category.enum';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<{ status: number; task: Task }> {
    const { title, description, done, category, boardId } = createTaskDto;

    const findBoard: Board = await this.boardRepository.findOneBy({ id: boardId });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findtask: Task = await this.taskRepository.findOneBy({ title, board_id: boardId });

    if (findBoard !== null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'task already belongs to the board' }, HttpStatus.BAD_REQUEST);

    const newTask: Task = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.category = category;
    newTask.board_id = findBoard.id;
    newTask.done = done;
    // newTask.created_by = description; TODO: z cookie
    // newTask.updated_by = description;

    return { status: 200, task: await this.taskRepository.save(newTask) };
  }

  async findAll(id: number): Promise<Task[]> {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    return this.taskRepository.findBy({ board_id: id });
  }

  findDetails(id: number): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<{ status: number; task: Task }> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });

    if (findTask === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid task' }, HttpStatus.BAD_REQUEST);

    const { title, description, done, category } = updateTaskDto;

    const updateTask: Task = new Task();

    updateTask.title = title;
    updateTask.description = description;
    updateTask.done = done;
    updateTask.category = category;
    // updateTask.updated_by = category; TODO: z cookie

    return { status: 200, task: await this.taskRepository.save(updateTask) };
  }

  async done(id: number): Promise<{ status: number; task: Task }> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });

    if (findTask === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid task' }, HttpStatus.BAD_REQUEST);

    const updateTask: Task = new Task();

    updateTask.done = true;
    // updateTask.updated_by = category; TODO: z cookie

    return { status: 200, task: await this.taskRepository.save(updateTask) };
  }

  async remove(id: number): Promise<void> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });
    this.taskRepository.remove(findTask);
  }
}
