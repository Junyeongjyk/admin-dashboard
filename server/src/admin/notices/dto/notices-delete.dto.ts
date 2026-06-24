import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NoticesDeleteRequestDto {

    @ApiProperty({
        description: '공지 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '공지 ID는 필수 입력값입니다.' })
    noticeId: number;

}