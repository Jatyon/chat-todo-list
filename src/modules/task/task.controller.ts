import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from '@modules/task/task.service';
import { CreateTaskDto } from '@modules/task/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/task/dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.taskService.findAll(+id);
  }

  @Get('details/:id')
  findDetails(@Param('id') id: string) {
    return this.taskService.findDetails(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch('done/:id')
  done(@Param('id') id: string) {
    return this.taskService.done(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
