import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FaqCategory } from "../../../common/enum/faq.enum";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class FaqsSearchRequestDto {

    @ApiPropertyOptional({
        description: '카테고리',
        enum: FaqCategory,
        example: FaqCategory.PAYMENT,
    })
    @IsOptional()
    @IsEnum(FaqCategory, { message: '유효하지 않은 카테고리 입니다.' })
    category?: FaqCategory;

    @ApiPropertyOptional({
        description: '키워드',
        example: '환불',
    })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({
        description: '공개 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiPropertyOptional({ description: '페이지', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page?: number;

    @ApiPropertyOptional({ description: '크기', example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    size?: number;
}