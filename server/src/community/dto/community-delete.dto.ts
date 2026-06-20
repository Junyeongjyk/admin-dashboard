import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsNumber, } from "class-validator";

export class CommunityDeleteRequestDto {

    @ApiProperty({
        description: '게시물 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '게시물 ID는 필수 입력값입니다.' })
    postId: number;

}