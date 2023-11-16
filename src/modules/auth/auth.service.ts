import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    console.log('2');
    const user: User = await this.userService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return email;
    }
    return null;
  }

  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.userService.findOne(email);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
  //   console.log('2');
  //   const { email } = loginUserDto;
  //   const payload: { email: string } = { email };
  //   return { access_token: this.jwtService.sign(payload) };
  // }
}
