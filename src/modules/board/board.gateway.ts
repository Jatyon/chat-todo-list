import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { TaskService } from '@modules/task/task.service';
import { ChatService } from '@modules/chat/chat.service';
import { Chat } from '@modules/chat/entities/chat.entity';
import { Message } from '@modules/message/entities/message.entity';
import { MessageService } from '@modules/message/message.service';
import { Task } from '@modules/task/entities/task.entity';
import { CreateTaskDto } from '@modules/task/dto/create-task.dto';
import { CreateTaskGatewayDto } from '@modules/task/dto/create-task-geteway.dto';
import { UpdateTaskDto } from '@modules/task/dto/update-task.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { WsAuthGuard } from '@modules/auth/guards/ws-auth.guard';
import { SocketAuthMiddleware } from '@modules/auth/guards/ws-auth.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class BoardGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly taskService: TaskService,
  ) {}

  @WebSocketServer()
  server: Server;

  // afterInit(client: Socket) {
  //   console.log("9");
  //   client.use(SocketAuthMiddleware() as any);
  // }

  @SubscribeMessage('connect')
  async handleChatJoinRoom(client: Socket) {
    console.log(client.id);
  }

  // @SubscribeMessage('chat:join:room')
  // async handleChatJoinRoom(client: any, data: { token: string }) {
  //   const { token } = data;
  //   client.join(token);
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   const messages: Message[] = await this.messageService.getMessages(chat.id);
  //   this.server.to(token).emit('chat:load:messages', messages);
  // }

  // @SubscribeMessage('chat:send:message')
  // async handleChatSendMessage(client: any, data: { token: string; user_id: string; content: string }) {
  //   const { token, user_id, content } = data;
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   const message = await this.messageService.saveMessage(chat.id, +user_id, content);
  //   this.server.to(token).emit('chat:new:message', message);
  // }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('board:join')
  async handleBoardJoin(client: any, roomToken: string) {
    client.join(roomToken);
    const chat: Chat = await this.chatService.getChatByToken(roomToken);
    const tasks: Task[] = await this.taskService.findAll(chat.board_id);
    this.server.to(roomToken).emit('board:load:tasks', tasks);
  }

  @SubscribeMessage('board:add:task')
  async handleAddTask(client: any, data: { createTaskGatewayDto: CreateTaskGatewayDto; token: string }) {
    const { token, createTaskGatewayDto } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const { board_id } = chat;
    const createTaskDto: CreateTaskDto = { token, ...createTaskGatewayDto, boardId: board_id };
    const task: Task = await this.taskService.create(createTaskDto, 'aaa'); //TODO: tutaj email
    this.server.to(token).emit('board:send:task', task);
  }

  // @SubscribeMessage('board:update:task')
  // async handleUpdateTask(client: any, data: { updateTaskDto: UpdateTaskDto; token: string; id: number }) {
  //   const { updateTaskDto, token, id } = data;
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   const task: Task = await this.taskService.update(id, updateTaskDto, 'aaa'); //TODO: tutaj email
  //   this.server.to(token).emit('board:send:task', task);
  // }

  // @SubscribeMessage('board:details:task')
  // async handleDetailsTask(client: any, data: { token: string; id: number }) {
  //   const { token, id } = data;
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   const task: Task = await this.taskService.findDetails(id);
  //   this.server.to(token).emit('board:send:details:task', task);
  // }

  // @SubscribeMessage('board:done:task')
  // async handleDoneTask(client: any, data: { token: string; id: number }) {
  //   const { token, id } = data;
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   const task: Task = await this.taskService.done(id, 'aaa'); //TODO: tutaj email
  //   this.server.to(token).emit('board:send:done:task', task);
  // }

  // @SubscribeMessage('boardRemoveTask')
  // async handleRemoveTask(client: any, data: { token: string; id: number }) {
  //   const { token, id } = data;
  //   const chat: Chat = await this.chatService.getChatByToken(token);
  //   await this.taskService.remove(id);
  //   this.server.to(token).emit('board:send:remove:task', id);
  // }
}
