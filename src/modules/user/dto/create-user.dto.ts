import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { lowerCaseTransformer } from "src/core/transformers/lower-case.transformer";

export class CreateUserDto {
    @ApiProperty({ example: 'test@test.com', type: String })
    @Transform(lowerCaseTransformer)
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(6)
    password?: string;

    provider?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nickname: string;
}