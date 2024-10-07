import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { lowerCaseTransformer } from "src/core/transformers/lower-case.transformer";

export class UpdateUserDto {
    @ApiProperty({ example: 'test@test.com', type: String })
    @Transform(lowerCaseTransformer)
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsOptional()
    provider?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    nickname?: string;
}