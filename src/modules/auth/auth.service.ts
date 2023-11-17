import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BoardService } from '../board/board.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    console.log('2');
    const user: User = await this.userService.findOne(email);
    if (user && user.password === password) {
      return email;
    }
    // if (user && (await bcrypt.compare(password, user.password))) {
    //   return email;
    // }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string; refresh_token: string }> {
    console.log('5');
    const { username: email } = loginUserDto;
    const payload: { email: string } = { email };
    return { access_token: this.jwtService.sign(payload), refresh_token: this.jwtService.sign(payload, { expiresIn: '60s' }) };
  }

  async refreshToken(user: { email: string }): Promise<{ access_token: string }> {
    console.log('10');
    const payload: { email: string } = { email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async ownerBoard(payload: { email: string }) {
    console.log('1');
    const isOwner: boolean = await this.boardService.findOwner(payload);
    if (isOwner) {
      return isOwner;
    }
    return null;
  }
}
