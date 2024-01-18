import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token.strategy';
import { ConfigService } from '@nestjs/config';
import { OwnerBoardStrategy } from '@modules/auth/strategies/owner-board.strategy';
import { BoardModule } from '@modules/board/board.module';

const configService: ConfigService = new ConfigService();

@Module({
  imports: [
    UserModule,
    BoardModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '2000s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy, OwnerBoardStrategy],
  exports: [AuthService],
})
export class AuthModule {}
