import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CommunityPostType, SearchType, CommunityCategory } from "../../../common/enum/community.eum";

export class CommunityListRequestDto {

    @ApiPropertyOptional({
        description: '게시물 내용 유형(카테고리)',
        enum: CommunityPostType,
        example: CommunityPostType.QUESTION,
    })
    @IsOptional()
    @IsEnum(CommunityPostType, {
        message: '유효하지 않은 게시물 카테고리입니다.',
    })
    category?: CommunityPostType;

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
    @ApiPropertyOptional({
        description: '커뮤니티 작성자 유형 (User / Partner)',
        enum: CommunityCategory,
        example: CommunityCategory.USER,
    })
    @IsOptional()
    @IsEnum(CommunityCategory, {
        message: '유효하지 않은 커뮤니티 타입입니다.',
    })
    type?: CommunityCategory;
}