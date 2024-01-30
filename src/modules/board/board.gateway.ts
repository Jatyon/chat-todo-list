import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
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
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly taskService: TaskService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const { authorization } = client.handshake.headers;
      const token: string = authorization.split(' ')[1];
      verify(token, configService.getOrThrow('JWT_SECRET'));
    } catch (error) {
      return this.disconnect(client);
    }
  }
  async handleDisconnect(client: Socket) {
    client.disconnect();
  }

  private disconnect(client: Socket) {
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }

  // afterInit(client: Socket) {
  //   console.log('9');
  //   // const a = client.use(SocketAuthMiddleware() as any);
  //   // console.log(a);
  //   console.log('s');
  // }

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

  @SubscribeMessage('board:join')
  async handleBoardJoin(client: Socket, boardId: string) {
    const chat: Chat = await this.chatService.getChatByBoard(+boardId);
    if (chat) {
      client.join(chat.token);
      const tasks: Task[] = await this.taskService.findAll(chat.board_id);
      this.server.to(chat.token).emit('board:load:tasks', tasks);
    } else this.disconnect(client);
  }

  @SubscribeMessage('board:add:task')
  async handleAddTask(client: Socket, data: { createTaskGatewayDto: CreateTaskGatewayDto; token: string }) {
    console.log(data);
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
