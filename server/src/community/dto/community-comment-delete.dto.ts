import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommunityPostType } from "../../common/enum/community.eum";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CommunityCommentDeleteRequestDto {

    @ApiProperty({
        description: '댓글 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '댓글 ID는 필수 입력값입니다.' })
    commentId: number;


}