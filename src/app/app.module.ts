import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { EmailService } from '@shared/send-mail'; //TODO:modul
import { UserModule } from '@modules/user/user.module';
import { ChatModule } from '@modules/chat/chat.module';
import { AuthModule } from '@modules/auth/auth.module';
import { BoardModule } from '@modules/board/board.module';
import { BoardUserModule } from '@modules/board-user/board-user.module';
import { MessageModule } from '@modules/message/message.module';
import { TaskModule } from '@modules/task/task.module';

import { TypeOrmFactory } from 'config/database.config';

const getEnvPath = () => (process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
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
