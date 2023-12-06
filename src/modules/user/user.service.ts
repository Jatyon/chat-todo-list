import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { EmailService } from 'src/helpers/send-mail';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { authenticator } from 'otplib';

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

  findOne(email: string): Promise<User | undefined> {
    console.log('3');
    return this.userRepository.findOneBy({ email });
  }

  async addAttemptsLogin(user: User): Promise<Date> {
    // TODO: jest 1 ale zmien
    if (user.attemts_login >= 1) {
      const date: Date = new Date();
      date.setMinutes(date.getMinutes() + 30);
      user.attemts_login = 0;
      user.block_login_at = date;
      this.userRepository.save(user);
      return date;
    }
    user.attemts_login += 1;
    this.userRepository.save(user);

    return null;
  }

  async removeBlockDate(user: User): Promise<void> {
    user.attemts_login = 0;
    user.block_login_at = null;
    this.userRepository.save(user);
  }

  async generateTwoFactorAuthSecret(user: User): Promise<{ otpauth_url: string; qr_code: string }> {
    const secret: string = authenticator.generateSecret(20);
    const otpauthUrl: string = authenticator.keyuri(user.email, 'AUTH_APP_NAME', secret);

    user.twoFa_secret = secret;
    this.userRepository.save(user);

    const qrCodeBuffer: Buffer = await qrcode.toBuffer(otpauthUrl);
    return {
      otpauth_url: otpauthUrl,
      qr_code: qrCodeBuffer.toString('base64'),
    };
  }

  disenableTwoFactorAuth(user: User): void {
    user.is_2fa = false;
    user.twoFa_secret = null;
    this.userRepository.save(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
