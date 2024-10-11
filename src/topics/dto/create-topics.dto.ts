import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTopicsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDate()
    @IsNotEmpty()
    start_time: Date;

    @IsDate()
    @IsNotEmpty()
    end_time: Date;
}