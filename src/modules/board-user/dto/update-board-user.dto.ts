import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardUserDto } from '@modules/board-user/dto/create-board-user.dto';

export class UpdateBoardUserDto extends PartialType(CreateBoardUserDto) {}
