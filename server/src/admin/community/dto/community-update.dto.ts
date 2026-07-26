import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CommunityPostType } from "../../../common/enum/community.eum";

export class CommunityUpdateRequestDto {

    @ApiProperty({
        description: '게시물 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '게시물 ID는 필수 입력값입니다.' })
    postId?: number;

    @ApiPropertyOptional({
        description: '게시물 유형(카테고리)',
        enum: CommunityPostType,
        example: CommunityPostType.SHARE,
    })
    @IsOptional()
    @IsEnum(CommunityPostType, { message: '유효하지 않은 카테고리입니다.' })
    category?: CommunityPostType;

    @ApiPropertyOptional({
        description: '제목',
        example: '제목을 수정합니다.',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: '내용',
        example: '내용을 수정합니다.',
    })
    @IsOptional()
    @IsString()
    content?: string;
}