import { Module } from '@nestjs/common';
import { EmailService } from '@shared/send-mail'; // TODO: modul
import { UserService } from '@modules/user/user.service';
import { UserController } from '@modules/user/user.controller';
import { UserRepository } from '@modules/user/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
