import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBoardDto } from '@modules/board/dto/create-board.dto';
import { BoardRepository } from '@modules/board/repositories/board.repository';
import { Board } from '@modules/board/entities/board.entity';
import { BoardUserRepository } from '@modules/board-user/repositories/board-user.repository';
import { BoardUser } from '@modules/board-user/entities/board-user.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { User } from '@modules/user/entities/user.entity';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
    private readonly boardUserRepository: BoardUserRepository,
    private dataSource: DataSource,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: { email: string }): Promise<{ status: number; message: string }> {
    console.log('9');
    const name: string = createBoardDto.name;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const findOwner: User = await this.userRepository.findOneBy({ email: user.email });
      const newBoard: Board = new Board();
      newBoard.name = name;
      newBoard.owner = findOwner.id;
      createBoardDto.members !== undefined ? (newBoard.shared = true) : (newBoard.shared = false);

      const boardCreated: Board = await queryRunner.manager.save(newBoard);

      const newBoardOwner: BoardUser = new BoardUser();
      newBoardOwner.board_id = boardCreated.id;
      newBoardOwner.user_id = findOwner.id;

      await queryRunner.manager.save(newBoardOwner);

      if (createBoardDto.members !== undefined) {
        for (const email of createBoardDto.members) {
          const findUser: User = await this.userRepository.findOneBy({ email });
          const newBoardUser: BoardUser = new BoardUser();
          newBoardUser.board_id = boardCreated.id;
          newBoardUser.user_id = findUser.id;
          await queryRunner.manager.save(newBoardUser);
        }
      }
      await queryRunner.commitTransaction();
      return { status: 201, message: 'Board was created' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return { status: 422, message: 'Error durnig creating board' };
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(user: { email: string }): Promise<Board[]> {
    const findUser: User = await this.userRepository.findOneBy({ email: user.email });
    return this.boardRepository.getBoardByUser(findUser.id);
  }

  async findOwner(user: { email: string }): Promise<boolean> {
    const findUser: User = await this.userRepository.findOneBy({ email: user.email });
    const owner: Board = await this.boardRepository.findOneBy({ owner: findUser.id });

    if (owner) return true;
    return false;
  }

  async findMembers(id: number): Promise<User[]> {
    const boardUsers: BoardUser[] = await this.boardUserRepository.findBy({ board_id: id });
    const userIds: number[] = boardUsers.map((user) => user.user_id);
    return await this.userRepository.getEmails(userIds);
  }

  async updateName(id: number, name: string, user: { email: string }): Promise<{ status: number; message: string }> {
    //TODO: guard ze tylko wlascicel moze zmieniac nazwe
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    if (findBoard.name === name)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Change name' }, HttpStatus.BAD_REQUEST);

    findBoard.name = name;

    await this.boardRepository.save(findBoard);

    return { status: 200, message: 'Name was changed' };
  }

  async addMember(id: number, newMember: string, user: { email: string }): Promise<{ email: string }> {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email: newMember });

    if (findUser === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid user' }, HttpStatus.BAD_REQUEST);

    const findOwner: User = await this.userRepository.findOneBy({ email: user.email });

    if (findOwner.id !== findBoard.owner)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    const findMember: User = await this.userRepository.getUserByBoard(id, newMember);
    if (findMember !== null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User already belongs to the board' }, HttpStatus.BAD_REQUEST);

    findBoard.shared = true;

    this.boardRepository.save(findBoard);
    const newBoardUser: BoardUser = new BoardUser();
    newBoardUser.board_id = id;
    newBoardUser.user_id = findUser.id;
    await this.boardUserRepository.save(newBoardUser);

    return { email: newMember };
  }

  async deleteMember(id: number, email: string, user: { email: string }) {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });

    if (findBoard === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid board' }, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userRepository.findOneBy({ email });

    if (findUser === null) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid user' }, HttpStatus.BAD_REQUEST);

    const findOwner: User = await this.userRepository.findOneBy({ email: user.email });

    if (findOwner.id !== findBoard.owner)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User no permission' }, HttpStatus.BAD_REQUEST);

    if (email === user.email)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Cannot remove owner' }, HttpStatus.BAD_REQUEST);

    const findMember: User = await this.userRepository.getUserByBoard(id, email);

    if (findMember === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'User not belongs to the board' }, HttpStatus.BAD_REQUEST);

    const findBoardByUser: BoardUser = await this.boardUserRepository.findOneBy({ board_id: id, user_id: findMember.id });

    await this.boardUserRepository.remove(findBoardByUser);
  }

  async remove(id: number): Promise<void> {
    const findBoard: Board = await this.boardRepository.findOneBy({ id });
    await this.boardRepository.remove(findBoard);
  }
}
