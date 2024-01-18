import { Injectable } from '@nestjs/common';
import { CreateBoardUserDto } from '@modules/board-user/dto/create-board-user.dto';
import { UpdateBoardUserDto } from '@modules/board-user/dto/update-board-user.dto';

@Injectable()
export class BoardUserService {
  create(createBoardUserDto: CreateBoardUserDto) {
    return 'This action adds a new boardUser';
  }

  findAll() {
    return `This action returns all boardUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boardUser`;
  }

  update(id: number, updateBoardUserDto: UpdateBoardUserDto) {
    return `This action updates a #${id} boardUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} boardUser`;
  }
}
