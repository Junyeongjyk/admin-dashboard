import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LogType } from "../../../common/enum/log.enum";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserType } from "../../../common/enum/users.enum";

export class LogUserRequestDto {
    @ApiPropertyOptional({
        description: "유저 유형",
        enum: UserType,
        example: UserType.USER,
    })
    @IsOptional()
    @IsEnum(UserType, { message: '로그 타입은 USER 또는 PARTNER 이어야 합니다.' })
    type?: UserType;

    @ApiPropertyOptional({
        description: '검색어(사용자ID/이름 등)',
        example: 'req_123',
    })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({
        description: '페이지',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({
        description: '페이지 크기',
        example: 20,
    })
    @IsOptional()
    @IsNumber()
    size?: number;
}