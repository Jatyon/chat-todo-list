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
import { PassportModule } from '@nestjs/passport';
import { TypeOrmFactory } from 'config/database.config';

const getEnvPath = () => (process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactory,
    }),
    AuthModule,
    BoardModule,
    BoardUserModule,
    ChatModule,
    MessageModule,
    TaskModule,
    UserModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
