import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TaskService } from '@modules/task/task.service';
import { CreateTaskDto } from '@modules/task/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/task/dto/update-task.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.taskService.create(createTaskDto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findAll(@Param('id') id: string, @Request() req) {
    return this.taskService.findAll(+id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('details/:id')
  findDetails(@Param('id') id: string) {
    return this.taskService.findDetails(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('done/:id')
  done(@Param('id') id: string, @Request() req) {
    return this.taskService.done(+id, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.taskService.update(+id, updateTaskDto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
