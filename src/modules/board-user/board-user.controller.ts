import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardUserService } from './board-user.service';
import { CreateBoardUserDto } from './dto/create-board-user.dto';
import { UpdateBoardUserDto } from './dto/update-board-user.dto';

@Controller('board-user')
export class BoardUserController {
  constructor(private readonly boardUserService: BoardUserService) {}

  @Post()
  create(@Body() createBoardUserDto: CreateBoardUserDto) {
    return this.boardUserService.create(createBoardUserDto);
  }

  @Get()
  findAll() {
    return this.boardUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardUserDto: UpdateBoardUserDto) {
    return this.boardUserService.update(+id, updateBoardUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardUserService.remove(+id);
  }
}
