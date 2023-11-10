import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import Randomstring from 'randomstring';
import { EmailService } from 'src/helpers/send-mail';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  private readonly randomstring = require('randomstring');

  async create(createUserDto: CreateUserDto): Promise<{ status: number; message: string }> {
    const { email, password, secondPassword } = createUserDto;

    const findExistedUser: User = await this.userRepository.findOneBy({ email });

    if (findExistedUser !== null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'The given user already exists' }, HttpStatus.BAD_REQUEST);

    if (password !== secondPassword)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'The given password is not identical to secondPassword' },
        HttpStatus.BAD_REQUEST,
      );

    const newUser: User = new User();

    const saltOrRounds: number = 10;
    const hash: string = await bcrypt.hash(password, saltOrRounds);

    const activateToken: string = this.randomstring.generate({ length: 32, charset: 'alphanumeric' });

    newUser.email = email;
    newUser.password = hash;
    newUser.is_active = false;
    newUser.activate_token = activateToken;
    await this.userRepository.save(newUser);

    this.emailService.sendActivationEmail(email, activateToken);

    return { status: 200, message: 'Activate link was sent' };
  }

  async forgotPasswordEmial(forgotPasswordDto: ForgotPasswordDto): Promise<{ status: number; message: string }> {
    const { email } = forgotPasswordDto;

    const findExistedUser: User = await this.userRepository.findOneBy({ email });

    if (findExistedUser === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email is invalid' }, HttpStatus.BAD_REQUEST);

    const forgotPasswordToken: string = this.randomstring.generate({ length: 32, charset: 'alphanumeric' });

    findExistedUser.activate_token = forgotPasswordToken;
    await this.userRepository.save(findExistedUser);

    this.emailService.sendForgotPasswordEmail(email, forgotPasswordToken);

    return { status: 200, message: 'Link was sent' };
  }

  async newPassword(newPasswordDto: NewPasswordDto): Promise<{ status: number; message: string }> {
    const { token, password, secondPassword } = newPasswordDto;

    const findExistedToken: User = await this.userRepository.findOneBy({ activate_token: token });

    if (findExistedToken === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'The given token not exists' }, HttpStatus.BAD_REQUEST);

    const hashedpassword: string = findExistedToken.password;

    const identicalPassword: boolean = await bcrypt.compare(password, hashedpassword);

    if (identicalPassword)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'The entered password is the same as the previous one' },
        HttpStatus.BAD_REQUEST,
      );

    if (password !== secondPassword)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'The passwords provided are different' }, HttpStatus.BAD_REQUEST);

    const saltOrRounds: number = 10;
    const hash: string = await bcrypt.hash(password, saltOrRounds);

    findExistedToken.password = hash;
    findExistedToken.activate_token = null;
    await this.userRepository.save(findExistedToken);

    return { status: 200, message: 'Password was changed' };
  }

  async activateUser(token: string): Promise<{ status: number; message: string }> {
    const findExistedToken: User = await this.userRepository.findOneBy({ activate_token: token });

    if (findExistedToken === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'invalid token' }, HttpStatus.BAD_REQUEST);

    findExistedToken.activate_token = null;
    findExistedToken.is_active = true;
    await this.userRepository.save(findExistedToken);

    return { status: 200, message: 'Account was activated' };
  }

  async forgotPassword(token: string) {
    const findExistedToken: User = await this.userRepository.findOneBy({ activate_token: token });

    if (findExistedToken === null)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Token is invalid' }, HttpStatus.BAD_REQUEST);

    return { status: 200, message: 'Token is valid' };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
