import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailService } from './helpers/send-mail';
import { BoardModule } from './modules/board/board.module';
import { BoardUserModule } from './modules/board-user/board-user.module';
import { MessageModule } from './modules/message/message.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['**/*.entity.js'],
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
    AuthModule,
    BoardModule,
    BoardUserModule,
    ChatModule,
    MessageModule,
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
