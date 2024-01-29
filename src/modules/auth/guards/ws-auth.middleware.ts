import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { WsAuthGuard } from './ws-auth.guard';

export const SocketAuthMiddleware = () => {
  return (client, next) => {
    try {
      console.log(2);
      console.log(WsAuthGuard.validateToken(client));
      WsAuthGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
