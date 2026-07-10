import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ChatUserBasicRequestDto {

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiProperty({
        description: '채팅 상대방 번호',
        example: 1,
        required: true
    })
    @IsNumber()
    @IsNotEmpty({ message: '채팅 상대방 번호는 필수 입력값입니다.' })
    chatRoomId?: number;
}