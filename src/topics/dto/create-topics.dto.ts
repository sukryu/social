import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  start_time: Date;

  @IsDateString()
  @IsNotEmpty()
  end_time: Date;
}
