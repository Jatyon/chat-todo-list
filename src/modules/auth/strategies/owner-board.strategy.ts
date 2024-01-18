import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@modules/auth/auth.service';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class OwnerBoardStrategy extends PassportStrategy(Strategy, 'owner-board') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: { email: string }) {
    console.log('1');
    const isOwner: boolean = await this.authService.ownerBoard(payload);
    if (!isOwner) {
      throw new UnauthorizedException();
    }
    return isOwner;
  }
}
