import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

const configService: ConfigService = new ConfigService();

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return false;
    console.log('1');
    const client: Socket = context.switchToWs().getClient();
    try {
      WsAuthGuard.validateToken(client);
    } catch (error) {
      return false;
    }

    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;

    const token: string = authorization.split(' ')[1];
    return verify(token, configService.getOrThrow('JWT_SECRET'));
  }
}
