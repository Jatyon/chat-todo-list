import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './repositories/board.repository';
import { Board } from './entities/board.entity';
import { BoardUserRepository } from '../board-user/repositories/board-user.repository';
import { BoardUser } from '../board-user/entities/board-user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
    private readonly boardUserRepository: BoardUserRepository,
    private dataSource: DataSource,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<{ status: number; message: string }> {
    const name: string = createBoardDto.name;

    await this.dataSource.transaction(async (): Promise<void> => {
      const newBoard: Board = new Board();
      newBoard.name = name;
      // newBoard.owner = name; TODO: tu z cookie

      const boardCreated: Board = await this.boardRepository.save(newBoard);

      if (createBoardDto.members !== undefined) {
        for (const email of createBoardDto.members) {
          const findUser: User = await this.userRepository.findOneBy({ email });
          const newBoardUser: BoardUser = new BoardUser();
          newBoardUser.board_id = boardCreated.id;
          newBoardUser.user_id = findUser.id;
          await this.boardUserRepository.save(newBoardUser);
        }
      }
    });

    return { status: 200, message: 'Board was created' };
  }

  findAll(): Promise<Board[]> {
    // TODO: tu z cookie
    const userId: number = 1;

    return this.boardRepository.getBoardByUser(userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  async updateName(id: number, name: string): Promise<{ status: number; message: string }> {
    //TODO: guard ze tylko wlasicicel moze zmieniac nazwe
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    if (findBoard.name === name)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Change name' }, HttpStatus.BAD_REQUEST);

    findBoard.name = name;

    await this.boardRepository.save(findBoard);

    return { status: 200, message: 'Name was changed' };
  }

  async addMember(id: number, email: string): Promise<{ status: number; message: string }> {
    //TODO: guard ze tylko wlasicicel moze dodawac
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email });

    if (findUser === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid user' }, HttpStatus.BAD_REQUEST);

    const findMember: User = await this.userRepository.getUserByBoard(id, email);

    if (findMember !== null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User already belongs to the board' }, HttpStatus.BAD_REQUEST);

    const newBoardUser: BoardUser = new BoardUser();
    newBoardUser.board_id = id;
    newBoardUser.user_id = findMember.id;
    await this.boardUserRepository.save(newBoardUser);

    return { status: 200, message: 'Member was added to board' };
  }

  async deleteMember(id: number, email: string): Promise<{ status: number; message: string }> {
    //TODO: guard ze tylko wlasicicel moze usuwac
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email });

    if (findUser === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid user' }, HttpStatus.BAD_REQUEST);

    const findMember: User = await this.userRepository.getUserByBoard(id, email);

    if (findMember === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User not belongs to the board' }, HttpStatus.BAD_REQUEST);

    const findBoardByUser: BoardUser = await this.boardUserRepository.findOneBy({ board_id: id, user_id: findMember.id });

    await this.boardUserRepository.remove(findBoardByUser);

    return { status: 200, message: 'Member was removed from board' };
  }

  async remove(id: number): Promise<void> {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });
    await this.boardRepository.remove(findBoard);
  }
}
