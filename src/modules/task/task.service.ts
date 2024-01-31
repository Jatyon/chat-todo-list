import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from '@modules/task/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/task/dto/update-task.dto';
import { TaskRepository } from '@modules/task/repositories/task.repository';
import { Task } from '@modules/task/entities/task.entity';
import { TaskCategory } from '@modules/task/enums/category.enum';
import { BoardRepository } from '@modules/board/repositories/board.repository';
import { Board } from '@modules/board/entities/board.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto, email: string): Promise<Task> {
    const { title, description, done, category, boardId } = createTaskDto;

    const findBoard: Board = await this.boardRepository.findOneBy({ id: boardId });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findTask: Task = await this.taskRepository.findOneBy({ title, board_id: boardId });

    if (findTask !== null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'task already belongs to the board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.getUserByBoard(boardId, email);

    if (findUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    const newTask: Task = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.category = category;
    newTask.board_id = findBoard.id;
    newTask.done = done;
    newTask.created_by = findUser.email;
    newTask.updated_by = findUser.email;

    return await this.taskRepository.save(newTask);
  }

  async findAll(id: number, email: string): Promise<Task[]> {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.getUserByBoard(id, email);

    if (findUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    return this.taskRepository.findBy({ board_id: id });
  }

  findDetails(id: number): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, email: string): Promise<Task> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });

    if (findTask === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid task' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email });

    if (findUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    const { title, description, done, category } = updateTaskDto;

    findTask.title = title;
    findTask.description = description;
    findTask.done = done;
    findTask.category = category;
    findTask.updated_by = findUser.email;

    return await this.taskRepository.save(findTask);
  }

  async done(id: number, email: string): Promise<Task> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });

    if (findTask === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid task' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email });

    if (findUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    findTask.done = true;
    findTask.updated_by = findUser.email;

    return await this.taskRepository.save(findTask);
  }

  async remove(id: number): Promise<void> {
    const findTask: Task = await this.taskRepository.findOneBy({ id });
    this.taskRepository.remove(findTask);
  }
}
