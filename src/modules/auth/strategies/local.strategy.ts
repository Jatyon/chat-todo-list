import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // async validate(email: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(email, password);
  //   console.log(user);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
  async validate(email: string, password: string): Promise<string> {
    console.log('1');
    const user: string | Date = await this.authService.validateUser(email, password);
    console.log(user);
    if (!user) throw new UnauthorizedException();
    else if (user === 'Account is not active') throw new UnauthorizedException({ description: user });
    else if (user instanceof Date) throw new UnauthorizedException({ date: user, description: 'login limit exceeded' });

    return user;
  }
}
