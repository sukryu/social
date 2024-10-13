import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTopicsDto {
  @IsNotEmpty()
  @IsNumber()
  topicsId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  start_time: Date;

  @IsOptional()
  @IsDate()
  end_time: Date;
}
