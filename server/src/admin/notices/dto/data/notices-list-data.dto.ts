import { ApiProperty } from "@nestjs/swagger";
import { NoticePriority, NoticesCategory } from "../../../common/enum/notices.enum";

export class NoticesItem {

    @ApiProperty({
        description: '공지사항 PK 번호', 
        example: 1,
        required:true, 
    })
    id: number

    @ApiProperty({
        description: '공지사항 제목', 
        example: '이용시 주의사항',
        required:true, 
    })
    title: string

    @ApiProperty({
        description: '공지사항 유형',
        enum: NoticesCategory, 
        example: NoticesCategory.NORMAL, 
        required: true
    })
    category: string;

    @ApiProperty({
        description: '공지사항 중요도',
        enum: NoticePriority, 
        example: NoticePriority.NORMAL, 
        required: true
    })
    priority: string;


    @ApiProperty({
        description: '공지사항 게시일',
        example: NoticesCategory.NORMAL, 
        required: true
    })
    reservedAt: string | null;

    @ApiProperty({
        description: '공지사항 등록(게시일)',
        example: NoticesCategory.NORMAL, 
        required: true
    })
    createdAt: string;
}

export class NoticesUserListResponseDto {
    @ApiProperty({
        description: '공지사항 리스트', 
        required:true, 
        type: () => [NoticesItem]
    })
    items: NoticesItem[]
}