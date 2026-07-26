import { ApiProperty } from "@nestjs/swagger";
import { CommunityListItem } from "./community-list-data.dto";

export class CommunityCommentItem {

    @ApiProperty({
        description: '댓글 ID',
        example: 10,
    })
    id?: number;

    @ApiProperty({
        description: '부모 댓글 ID (최상위 댓글은 null)',
        example: null,
        nullable: true,
    })
    parentId?: number | null;

    @ApiProperty({
        description: '댓글 작성자 ID',
        example: 3,
    })
    authorId?: number;

    @ApiProperty({
        description: '댓글 작성자명',
        example: '김철수',
    })
    authorName?: string;

    @ApiProperty({
        description: '댓글 내용',
        example: '좋은 글이네요!',
    })
    content?: string;

    @ApiProperty({
        description: '삭제 여부',
        example: false,
    })
    isDeleted?: boolean;

    @ApiProperty({
        description: '댓글 등록일',
        example: '2026-01-01 12:30:00',
    })
    createdAt?: string;

    @ApiProperty({
        description: '자식 댓글 (대댓글 / 대대댓글)',
        type: () => [CommunityCommentItem],
    })
    children?: CommunityCommentItem[];
}


export class CommunityUserDetailResponseDto extends CommunityListItem{

    @ApiProperty({
        description: '커뮤니티 내용', 
        example: '탐정 추천해주세요',
        required: false
    })
    content?: string

    @ApiProperty({
        description: '댓글 목록 (대댓글 / 대대댓글 포함)',
        type: () => [CommunityCommentItem],
    })
    comments?: CommunityCommentItem[];

}