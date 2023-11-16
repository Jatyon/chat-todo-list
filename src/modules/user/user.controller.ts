import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

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

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
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
