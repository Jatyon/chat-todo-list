import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { TaskService } from '../task/task.service';
import { ChatService } from '../chat/chat.service';
import { Server } from 'socket.io';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from '../message/entities/message.entity';
import { MessageService } from '../message/message.service';
import { Task } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { CreateTaskGatewayDto } from '../task/dto/create-task-geteway.dto';
import { UpdateTaskDto } from '../task/dto/update-task.dto';

@WebSocketGateway()
export class BoardGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly taskService: TaskService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chatJoinRoom')
  async handleChatJoinRoom(client: any, data: { token: string }) {
    const { token } = data;
    client.join(token);
    const chat: Chat = await this.chatService.getChatByToken(token);
    const messages: Message[] = await this.messageService.getMessages(chat.id);
    this.server.to(token).emit('chatLoadMessages', messages);
  }

  @SubscribeMessage('chatSendMessage')
  async handleChatSendMessage(client: any, data: { token: string; user_id: string; content: string }) {
    const { token, user_id, content } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const message = await this.messageService.saveMessage(chat.id, +user_id, content);
    this.server.to(token).emit('chatNewMessage', message);
  }

  @SubscribeMessage('boardJoin')
  async handleBoardJoin(client: any, data: { token: string }) {
    const { token } = data;
    client.join(token);
    const chat: Chat = await this.chatService.getChatByToken(token);
    const tasks: Task[] = await this.taskService.findAll(chat.board_id);
    this.server.to(token).emit('boardLoadTasks', tasks);
  }

  @SubscribeMessage('boardAddTask')
  async handleAddTask(client: any, data: { createTaskGatewayDto: CreateTaskGatewayDto; token: string }) {
    const { token, createTaskGatewayDto } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const { board_id } = chat;
    const createTaskDto: CreateTaskDto = { token, ...createTaskGatewayDto, boardId: board_id };
    const task: { status: number; task: Task } = await this.taskService.create(createTaskDto);
    this.server.to(token).emit('boardSendTask', task.task);
  }

  @SubscribeMessage('boardUpdateTask')
  async handleUpdateTask(client: any, data: { updateTaskDto: UpdateTaskDto; token: string; id: number }) {
    const { updateTaskDto, token, id } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const task: { status: number; task: Task } = await this.taskService.update(id, updateTaskDto);
    this.server.to(token).emit('boardSendTask', task.task);
  }

  @SubscribeMessage('boardDetailsTask')
  async handleDetailsTask(client: any, data: { token: string; id: number }) {
    const { token, id } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const task: Task = await this.taskService.findDetails(id);
    this.server.to(token).emit('boardSendDetailsTask', task);
  }

  @SubscribeMessage('boardDoneTask')
  async handleDoneTask(client: any, data: { token: string; id: number }) {
    const { token, id } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const task: { status: number; task: Task } = await this.taskService.done(id);
    this.server.to(token).emit('boardSendDoneTask', task.task);
  }

  @SubscribeMessage('boardRemoveTask')
  async handleRemoveTask(client: any, data: { token: string; id: number }) {
    const { token, id } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    await this.taskService.remove(id);
    this.server.to(token).emit('boardSendRemoveTask', id);
  }
}
