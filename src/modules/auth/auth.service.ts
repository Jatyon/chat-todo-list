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
    const user: User = await this.userService.findOne(email);
    if (user && password === user.password) {
      return email;
    }
    // if (user && bcrypt.compare(password, user.password)) {
    //   return email;
    // }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email } = loginUserDto;
    const payload: { email: string } = { email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
