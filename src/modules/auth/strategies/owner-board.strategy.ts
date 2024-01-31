import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@modules/auth/auth.service';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

@Injectable()
export class OwnerBoardStrategy extends PassportStrategy(Strategy, 'owner-board') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string }) {
    console.log('11111');
    const isOwner: boolean = await this.authService.ownerBoard(payload);
    if (!isOwner) {
      throw new UnauthorizedException();
    }
    return isOwner;
  }
}
