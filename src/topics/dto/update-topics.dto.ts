import {
  IsDateString,
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
  @IsDateString()
  start_time: Date;

  @IsOptional()
  @IsDateString()
  end_time: Date;
}
