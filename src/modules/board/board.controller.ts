import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerBoardGuard } from '../auth/guards/owner-board-auth.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    return this.boardService.create(createBoardDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.boardService.findAll(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string, @Request() req) {
  //   return this.boardService.findOne(+id, req.user);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateName(@Param('id') id: string, @Body() name: string, @Request() req) {
    return this.boardService.updateName(+id, name, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  addMember(@Param('id') id: string, @Body() member: string, @Request() req) {
    return this.boardService.addMember(+id, member, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(204)
  deleteMember(@Param('id') id: string, @Body() member: string, @Request() req) {
    return this.boardService.deleteMember(+id, member, req.user);
  }

  @UseGuards(OwnerBoardGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() req) {
    console.log(req.user);
    return this.boardService.remove(+id);
  }
}
