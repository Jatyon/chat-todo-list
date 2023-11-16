import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty()
  title: string;

  @IsString({ message: 'description must be string' })
  @IsNotEmpty()
  description: string;

  @IsString({ message: 'category must be string' })
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  done: boolean;
}
