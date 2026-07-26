import { ApiProperty } from "@nestjs/swagger";
import { CommunityPostType } from "../../../../common/enum/community.eum";

export class CommunityListItem {

    @ApiProperty({ 
        description: '커뮤니티 게시물 등록 ID',
        example: 1,
        required: true
    })
    id?: number;

    @ApiProperty({
        description: '게시물 카테고리',
        enum: CommunityPostType,
        example: CommunityPostType.SHARE,
        required: true
    })
    category?: CommunityPostType;

    @ApiProperty({ 
        description: '게시물  제목',
        example: '업무 노하우 공유합니다.',
        required: true
     })
    title?: string;

    @ApiProperty({ 
        description: '등록자 ID',
        example: 1,
        required: true
    })
    authorId?: Number;

    @ApiProperty({ 
        description: '등록자 명',
        example: '홍길동',
        required: true
    })
    authorName?: string;

    @ApiProperty({ 
        description: '조회수',
        example: 0,
        required: true
    })
    viewCount?: number;

    @ApiProperty({ 
        description: '등록일',
        example: '2026-01-01 01:01:01', 
        required: true
    })
    createdAt?: string;
}

class CommunityListPage {
    @ApiProperty({ description: '현재 페이지', example: 1 })
    page?: number;

    @ApiProperty({ description: '페이지 크기', example: 20 })
    size?: number;

    @ApiProperty({ description: '전체 개수', example: 132 })
    totalCount?: number;

    @ApiProperty({ description: '전체 페이지 수', example: 7 })
    totalPages?: number;

    @ApiProperty({ description: '다음 페이지 존재 여부', example: true })
    hasNext?: boolean;
}


export class  CommunityListResponseDto {
     @ApiProperty({
        description: '게시물 목록',
        type: [CommunityListItem],
        example: [
            {
                id: 1,
                title: '공지사항 안내',
                authorId: 1,
                createdAt: '2026-01-01 01:01:01',
            },
        ],
    })
    items?: CommunityListItem[];

    @ApiProperty({
        description: '페이지 정보',
        type: CommunityListPage,
        example: {
            page: 1,
            size: 20,
            totalCount: 132,
            totalPages: 7,
            hasNext: true,
        },
    })
    page?: CommunityListPage;
}