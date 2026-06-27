import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommunityCategory, CommunityPostType, SearchType } from "../../common/enum/community.eum";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CommunityUserListRequestDto {

    @ApiProperty({
        description: '게시물 내용 유형(카테고리)',
        enum: CommunityCategory,
        example: CommunityCategory.CLIENT,
        required: true
    })
    @IsEnum(CommunityCategory, {
        message: '유효하지 않은 게시물 카테고리입니다.',
    })
    category: CommunityCategory;

    @ApiPropertyOptional({ description: '페이지', example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ description: '검색어', example: '의뢰' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ 
        description: '검색어 타입',
        enum: SearchType, 
        example: SearchType.TITLE 
    })
    @IsOptional()
    @IsEnum(SearchType)
    filter?: SearchType;

    @ApiPropertyOptional({ description: '페이지 크기', example: 20 })
    @IsOptional()
    @IsNumber()
    size?: number;
}