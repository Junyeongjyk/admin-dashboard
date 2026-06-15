import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UsersAlamRequestDto {

    @ApiPropertyOptional({
        description: '이메일 알림 수신 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    email?: boolean;

    @ApiPropertyOptional({
        description: '마케팅 알림 수신 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    marketing?: boolean;

    @ApiPropertyOptional({
        description: '푸시 알림 수신 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    push?: boolean;

    @ApiPropertyOptional({
        description: 'SMS 알림 수신 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    sms?: boolean;

}