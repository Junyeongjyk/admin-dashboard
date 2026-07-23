import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class ChatSendRequestDto {

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined; // ''도 undefined로
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiProperty({
        description: '채팅방 번호',
        example: 1,
    })
    @IsInt() // id는 보통 정수니까 IsInt 추천
    roomId?: number
    
    @ApiProperty({
        description: '메세지 내용',
        example: '문의드립니다.',
    })
    @IsString()
    @IsOptional()
    @ValidateIf((o) => o.content !== null) // null도 스킵
    content?: string | null

    @ApiPropertyOptional({
        description: '상담시 업로그된 파일',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    chatFile: any;

}