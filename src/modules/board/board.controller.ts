import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  updateName(@Param('id') id: string, @Body() name: string) {
    return this.boardService.updateName(+id, name);
  }

  @Patch(':id')
  addMember(@Param('id') id: string, @Body() member: string) {
    return this.boardService.addMember(+id, member);
  }

  @Patch(':id')
  deleteMember(@Param('id') id: string, @Body() member: string) {
    return this.boardService.deleteMember(+id, member);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
