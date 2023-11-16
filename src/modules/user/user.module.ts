import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from 'src/helpers/send-mail';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
