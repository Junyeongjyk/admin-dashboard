import { ApiProperty } from "@nestjs/swagger";
import { CommunityPostType } from "../../../common/enum/community.eum";


export class  CommunityCommentCreateResponseDto {
    @ApiProperty({
        description: '댓글 ID',
        example: 1,
        required: true,
    })
    commentId?: number;

    @ApiProperty({
        description: '생성 시각',
        example: '2026-01-01 01:01:01',
        required: true,
    })
    createdAt?: string;
}