import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardUserDto } from './create-board-user.dto';

export class UpdateBoardUserDto extends PartialType(CreateBoardUserDto) {}
