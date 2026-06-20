import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommunityPostType } from "../../common/enum/community.eum";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CommunityCommentCreateRequestDto {

    @ApiProperty({
        description: '게시물 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '게시물 ID는 필수 입력값입니다.' })
    postId: number;

    @ApiProperty({
        description: '댓글 내용',
        example: '좋은 글 감사합니다!',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: 'content는 필수 입력값입니다.' })
    content: string;

    @ApiPropertyOptional({
        description: '부모 댓글 ID (대댓글일 때)',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    parentId?: number;

}