import { Controller, Body, UseGuards, Post, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    console.log('4');
    return this.authService.login(loginUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    console.log('9');
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor-auth/enable')
  async enableTwoFactorAuth(@Request() req) {
    return this.authService.enableTwoFactorAuth(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor-auth/verify')
  async verifyTwoFactorAuth(@Request() req) {
    const { token } = req.body;
    return this.authService.verifyTwoFactorAuth(req.user.email, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('7');
    return req.user;
  }
}
