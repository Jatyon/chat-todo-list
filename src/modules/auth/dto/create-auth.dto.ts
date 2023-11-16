import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'email must be string' })
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'password must be string' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password: string;
}
