import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BoardService } from '../board/board.service';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string | Date> {
    console.log('2');
    const user: User = await this.userService.findOne(email);
    if (user) {
      if (!user.is_active) return 'Account is not active';

      const isBlockLogin: boolean | Date = await this.checkBlockLoginTime(user);
      if (isBlockLogin instanceof Date) return isBlockLogin;

      if (user.password === password) {
        this.userService.removeBlockDate(user);
        return user.email;
      } else return await this.userService.addAttemptsLogin(user);
    }

    // if (user && (await bcrypt.compare(password, user.password))) {
    //   return email;
    // }
    return null;
  }

  async checkBlockLoginTime(user: User): Promise<boolean | Date> {
    if (user.block_login_at) {
      const now: Date = new Date();
      if (now < user.block_login_at) return user.block_login_at;
      await this.userService.removeBlockDate(user);
    }
    return true;
  }

  async is2FA(loginUserDto: LoginUserDto): Promise<boolean> {
    console.log('5');
    const { username: email } = loginUserDto;
    const user: User = await this.userService.findOne(email);
    if (user.is_2fa) return true;
    return null;
  }
  async login(email: string): Promise<{ access_token: string; refresh_token: string }> {
    console.log('5');
    const payload: { email: string } = { email };
    return { access_token: this.jwtService.sign(payload), refresh_token: this.jwtService.sign(payload, { expiresIn: '60s' }) };
  }

  async refreshToken(user: { email: string }): Promise<{ access_token: string }> {
    console.log('10');
    const payload: { email: string } = { email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async enableTwoFactorAuth(email: string): Promise<any> {
    const user: User = await this.userService.findOne(email);
    if (user) return this.userService.generateTwoFactorAuthSecret(user);

    return null;
  }

  async disenableTwoFactorAuth(email: string): Promise<void> {
    const user: User = await this.userService.findOne(email);
    this.userService.disenableTwoFactorAuth(user);
  }

  async verifyTwoFactorAuth(email: string, token: string): Promise<boolean> {
    const user: User = await this.userService.findOne(email);
    if (!user) return false;

    return authenticator.verify({
      token: token,
      secret: user.twoFa_secret,
    });
  }

  async ownerBoard(payload: { email: string }) {
    console.log('1');
    const isOwner: boolean = await this.boardService.findOwner(payload);
    if (isOwner) return isOwner;

    return null;
  }
}
