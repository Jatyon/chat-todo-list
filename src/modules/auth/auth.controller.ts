import { Controller, Body, UseGuards, Post, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // login(@Request() reg) {
  //   console.log("1");
  //   return this.authService.login(reg.user);
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // login(@Body() loginUserDto: LoginUserDto) {
  //   return this.authService.login(loginUserDto);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
