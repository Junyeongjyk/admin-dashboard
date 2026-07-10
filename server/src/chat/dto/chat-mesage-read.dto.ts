import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ChatUserMessageReadRequestDto {
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiProperty({
        description: '메세지 등록 번호',
        example: 1,
        required: true
    })
    @IsNumber()
    @IsNotEmpty({ message: '메시지 등록번호는 필수 입력값입니다.' })
    messageId?: number;
}