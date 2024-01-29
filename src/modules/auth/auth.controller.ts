import { Controller, Body, UseGuards, Post, Request, Get, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@modules/auth/auth.service';
import { LoginUserDto } from '@modules/auth/dto/create-auth.dto';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RefreshJwtGuard } from '@modules/auth/guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('4');
    if (await this.authService.is2FA(loginUserDto)) return { email: loginUserDto.username, is_2fa: true };
    return this.authService.login(loginUserDto.username);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    console.log('9');
    console.log(req.user);
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor-auth/enable')
  async enableTwoFactorAuth(@Request() req) {
    console.log(req);
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

  @Post('set/two-factor-auth')
  async setTwoFactorAuth(@Request() req) {
    console.log(req.body);
    const { email, token } = req.body;
    if (await this.authService.verifyTwoFactorAuth(email, token)) {
      await this.authService.setTwoFactorAuth(email);
      return { message: '2fa zrobiona' };
    }
    throw new UnauthorizedException({ description: 'invalid Code' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('7');
    return req.user;
  }
}
