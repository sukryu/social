import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { plainToInstance, Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Topics } from "../domain/topics";

export class FilterTopicsDto {
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    title?: string | null;
  
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    description?: string | null;
  
    @ApiPropertyOptional({ type: Date })
    @IsOptional()
    @Type(() => Date)
    start_time?: Date | null;
  
    @ApiPropertyOptional({ type: Date })
    @IsOptional()
    @Type(() => Date)
    end_time?: Date | null;
  
    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsNumber()
    createdBy?: number | null;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsNumber()
    updatedBy?: number | null;
}

export class SortTopicsDto {
    @ApiProperty()
    @Type(() => String)
    @IsString()
    orderBy: keyof Topics;
  
    @ApiProperty()
    @IsString()
    order: 'ASC' | 'DESC';
}

export class QueryTopicsDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;
  
    @ApiPropertyOptional()
    @Transform(({ value }) => (value ? Number(value) : 10))
    @IsNumber()
    @IsOptional()
    limit?: number;
  
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @Transform(({ value }) =>
      value ? plainToInstance(FilterTopicsDto, JSON.parse(value)) : undefined,
    )
    @ValidateNested()
    @Type(() => FilterTopicsDto)
    filters?: FilterTopicsDto | null;
  
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @Transform(({ value }) =>
      value ? plainToInstance(SortTopicsDto, JSON.parse(value)) : undefined,
    )
    @ValidateNested({ each: true })
    @Type(() => SortTopicsDto)
    sort?: SortTopicsDto[] | null;
  }