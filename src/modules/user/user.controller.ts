import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { ForgotPasswordDto } from '@modules/user/dto/forgot-password.dto';
import { NewPasswordDto } from '@modules/user/dto/new-password.dto';
import { User } from '@modules/user/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/forgot-password')
  forgotPasswordEmial(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPasswordEmial(forgotPasswordDto);
  }

  @Post('/new-password')
  newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.userService.newPassword(newPasswordDto);
  }

  @Get('/active-account/:token')
  activateUser(@Param('token') token: string) {
    return this.userService.activateUser(token);
  }

  @Get('/forgot-password/:token')
  forgotPassword(@Param('token') token: string) {
    return this.userService.forgotPassword(token);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get')
  async findOneByEmail(@Body() email: { email: string }) {
    const user: User = await this.userService.findOne(email.email);
    return { email: user.email, lastLoggedAt: user.last_logged_at, is2fa: user.is_2fa };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
