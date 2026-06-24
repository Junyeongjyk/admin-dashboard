import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { NoticesCategory, NoticeTarget } from "../../../common/enum/notices.enum";

export class NoticesCreateRequestDto {

    @ApiProperty({
        description: '공지 카테고리',
        enum: NoticesCategory,
        example: NoticesCategory.SYSTEM,
        required: true,
    })
    @IsEnum(NoticesCategory, { message: '유효하지 않은 카테고리 입니다.' })
    category: NoticesCategory;

    @ApiProperty({
        description: "대상('PARTNER'|'USER'|'ALL')",
        enum: NoticeTarget,
        example: NoticeTarget.ALL,
        required: true,
    })
    @IsEnum(NoticeTarget, { message: '유효하지 않은 대상 입니다.' })
    target: NoticeTarget;

    @ApiPropertyOptional({
        description: '필수 공지 여부(필수 확인 유도)',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    required?: boolean;

    @ApiPropertyOptional({
        description: '노출 우선순위',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    priority?: number;

    @ApiProperty({
        description: '제목',
        example: '점검 안내',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
    title: string;

    @ApiProperty({
        description: '본문',
        example: '<p>서비스 점검이 예정되어 있습니다.</p>',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '본문은 필수 입력값입니다.' })
    content: string;

    @ApiPropertyOptional({
        description: '첨부파일 fileId 목록',
        example: [1],
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    attachments?: number[];

    @ApiPropertyOptional({
        description: '예약 발행 시각',
        example: '2025-12-31 09:00:00',
    })
    @IsOptional()
    @IsString()
    publishedAt?: string;

}