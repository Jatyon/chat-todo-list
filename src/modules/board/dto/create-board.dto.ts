import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString({ each: true })
  members: string[];
}
