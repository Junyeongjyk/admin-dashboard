import { ApiProperty } from "@nestjs/swagger";
import { CommunityCategory, CommunityPostType } from "../../../common/enum/community.eum";
import { BannerPosition } from "../../../common/enum/system.enum";

export class CommunityUserListItem {

    @ApiProperty({ 
        description: '커뮤니티 게시물 등록 ID',
        example: 1,
        required: true
    })
    id?: number;

    @ApiProperty({
        description: '게시물 카테고리',
        enum: CommunityPostType,
        example: CommunityCategory.USER,
        required: true
    })
    category?: CommunityCategory;

    @ApiProperty({
        description: '게시물 유형',
        example: 'USER',
        required: true
    })
    type?: string;

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
    authorId?: number;

    @ApiProperty({ 
        description: '등록자 명',
        example: '홍길동',
        required: true
    })
    authorName?: string;

    @ApiProperty({ 
        description: '추천수',
        example: 0,
        required: true
    })
    likeCount?: number;

    @ApiProperty({ 
        description: '조회수',
        example: 0,
        required: true
    })
    viewCount?: number;


    @ApiProperty({ 
        description: '등록일',
        example: '2026-01-01', 
        required: true
    })
    createdAt?: string;

}

export class EventBannerItem {
    @ApiProperty({ 
        description: '배너위치',
        example: BannerPosition.UP,
        required: true
    })
    position?: string;

    @ApiProperty({ 
        description: '배너 제목',
        example: '할인 이벤트',
        required: true
    })
    title?: string;

    @ApiProperty({ 
        description: '배너 내용',
        example: '할일인 이벤트 시작합니다.',
        required: true
    })
    content?: string;

    @ApiProperty({ 
        description: '버튼 제목',
        example: '이동',
    })
    buttonTitle?: string | null;

    @ApiProperty({ 
        description: '버튼 클릭 이동 PATH',
        example: '/test/1',
    })
    link?: string | null;

}

export class  CommunityUserListResponseDto {
     @ApiProperty({
        description: '게시물 목록',
        type: [CommunityUserListItem],
        example: [
        {
            id: 'post_123',
            title: '공지사항 안내',
            authorId: 1,
            authorName: '홍길동',
            likeCount: 0,
            viewCount: 0,
            createdAt: '2026-01-01',
        },
        ],
    })
    items?: CommunityUserListItem[];


    @ApiProperty({
        description: '게시물 목록',
        type: [EventBannerItem],
    })
    banners?: EventBannerItem[];
}