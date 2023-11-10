import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString({ message: 'email must be string' })
  @IsNotEmpty()
  email: string;
}
