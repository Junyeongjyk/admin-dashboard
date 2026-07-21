import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class ChatUserSendRequestDto {

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined; // ''도 undefined로
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiPropertyOptional({
        description: '채팅방 번호',
        example: 1,
    })
    @IsOptional() // undefined면 스킵
    @ValidateIf((o) => o.roomId !== null) // ✅ null이면 스킵 (원하면)
    @IsInt() // id는 보통 정수니까 IsInt 추천
    roomId?: number | null;
    
    @ApiProperty({
        description: '메세지 내용',
        example: '문의드립니다.',
    })
    @IsString()
    @IsOptional()
    @ValidateIf((o) => o.content !== null) // null도 스킵
    content?: string | null

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined; // ''도 undefined로
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiProperty({
        description: '상대방ID - 유저이 첫 채팅 시도시',
        example: 1,
        required: false
    })
    @IsOptional()
    @ValidateIf((o) => o.fromId !== null) // null도 스킵
    @Type(() => Number)   // ⭐ 핵심
    @IsNumber()
    fromId?: number | null

    @ApiPropertyOptional({
        description: '상담시 업로그된 파일',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    chatFile: any;


    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined; // ''도 undefined로
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiProperty({
        description: '상담유형 0: 유저 <-> 파트너, 1: 유저/파트너 <-> 관리자' ,
        example: 1,
        required: false
    })
    @IsNumber()
    type?: number
}