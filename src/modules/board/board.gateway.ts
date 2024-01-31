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

import { verify, JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';

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
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const { authorization } = client.handshake.headers;
      const token: string = authorization.split(' ')[1];
      const tokenData = verify(token, configService.getOrThrow('JWT_SECRET'));
      if (typeof tokenData !== 'string') client.emit('user:email', tokenData.email);
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

  @SubscribeMessage('board:join')
  async handleBoardJoin(client: Socket, data: { boardId: string; email: string }) {
    const { boardId, email } = data;
    const chat: Chat = await this.chatService.getChatByBoard(+boardId);
    if (chat) {
      const findUser: User = await this.userService.getUserByBoard(+boardId, email);
      if (findUser) {
        client.join(chat.token);
        const tasks: Task[] = await this.taskService.findAll(chat.board_id, email);
        client.emit('board:load:tasks', tasks);
        client.emit('board:token', chat.token);
      } else this.disconnect(client);
    } else this.disconnect(client);
  }

  @SubscribeMessage('chat:join:room')
  async handleChatJoinRoom(client: Socket, data: { token: string }) {
    const chat: Chat = await this.chatService.getChatByToken(data.token);
    if (chat) {
      const messages: Message[] = await this.messageService.getMessages(chat.id);
      client.emit('chat:load:messages', messages);
    } else this.disconnect(client);
  }

  @SubscribeMessage('chat:send:message')
  async handleChatSendMessage(client: Socket, data: { token: string; email: string; content: string }) {
    const { token, email, content } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const message: Message = await this.messageService.saveMessage(chat.id, chat.board_id, email, content);
    this.server.to(token).emit('chat:new:message', message);
  }

  @SubscribeMessage('board:add:task')
  async handleAddTask(client: Socket, data: { newTask: CreateTaskGatewayDto; token: string; email: string }) {
    console.log(data);
    const { token, email, newTask } = data;
    const chat: Chat = await this.chatService.getChatByToken(token);
    const { board_id } = chat;
    const createTaskDto: CreateTaskDto = { ...newTask, boardId: board_id };
    const task: Task = await this.taskService.create(createTaskDto, email);
    this.server.to(token).emit('board:send:task', task);
  }

  @SubscribeMessage('board:update:task')
  async handleUpdateTask(client: Socket, data: { updateTask: UpdateTaskDto; token: string; id: number; email: string }) {
    const { updateTask, token, id, email } = data;
    const task: Task = await this.taskService.update(id, updateTask, email);
    this.server.to(token).emit('board:send:update:task', task);
  }

  @SubscribeMessage('board:done:task')
  async handleDoneTask(client: Socket, data: { token: string; email: string; id: number }) {
    const { token, email, id } = data;
    const task: Task = await this.taskService.done(id, email);
    this.server.to(token).emit('board:send:done:task', task);
  }

  @SubscribeMessage('board:remove:task')
  async handleRemoveTask(client: any, data: { token: string; email: string; id: number }) {
    const { token, id } = data;
    await this.taskService.remove(id);
    this.server.to(token).emit('board:send:remove:task', id);
  }
}
