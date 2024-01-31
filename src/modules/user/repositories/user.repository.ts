import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getUserByBoard(boardId: number, email: string): Promise<User> {
    return this.createQueryBuilder('user')
      .innerJoin('user.board_users', 'board_users')
      .innerJoin('board_users.board', 'board')
      .select(['user'])
      .where('user.email= :email', { email })
      .andWhere('board.id= :boardId', { boardId })
      .getOne();
  }

  getEmails(userIds: number[]): Promise<User[]> {
    return this.createQueryBuilder('user').select(['user.email']).where('user.id IN (:...userIds)', { userIds }).getMany();
  }
}
