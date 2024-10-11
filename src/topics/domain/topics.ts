import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class Topics {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: Number })
    @Expose({ groups: ['admin'] })
    createdBy: number;

    @ApiProperty({ type: Number })
    @Expose({ groups: ['admin'] })
    updatedBy: number;

    @ApiProperty({ type: String, example: 'Food' })
    title: string;

    @ApiProperty({ type: String, description: 'Post about food' })
    description: string;

    @ApiProperty({ type: Date, example: "2024-10-11T09:00:00+09:00" })
    start_time: Date;

    @ApiProperty({ type: Date, example: '2023-10-11T09:00:00+09:00' })
    end_time: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}