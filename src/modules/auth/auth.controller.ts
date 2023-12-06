import { Controller, Body, UseGuards, Post, Request, Get, UnauthorizedException } from '@nestjs/common';
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
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('4');
    if (await this.authService.is2FA(loginUserDto)) return { email: loginUserDto.username, is_2fa: true };
    return this.authService.login(loginUserDto.username);
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
  @Post('two-factor-auth/disenable')
  async disenableTwoFactorAuth(@Request() req) {
    return this.authService.disenableTwoFactorAuth(req.user.email);
  }

  @Post('two-factor-auth/verify')
  async verifyTwoFactorAuth(@Request() req) {
    console.log(req.body);
    const { email, token } = req.body;
    if (await this.authService.verifyTwoFactorAuth(email, token)) return this.authService.login(email);
    throw new UnauthorizedException({ description: 'invalid Code' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('7');
    return req.user;
  }
}
