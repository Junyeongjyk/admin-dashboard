import { ApiProperty } from "@nestjs/swagger";

export class ChatMessageDataItem {
    @ApiProperty({
        description: '메세지등록 번호',
        example: 1,
        required: true,
    })
    id?: number;

    @ApiProperty({
        description: '등록자',
        example: 1,
        required: true,
    })
    senderId?: number;

    @ApiProperty({
        description: '메세지 내용',
        example: '문의 드립니다.',
    })
    content?: string;

    @ApiProperty({
        description: '등록일',
        example: '2026-01-01 00:00:00',
        required: true,
    })
    createdAt?: string;
}


export class ChatMassgeDataResponseDto {
 
    @ApiProperty({
        description: '채팅 룸 ID',
        required: true,
    })
    roomId: number | null | undefined;

    @ApiProperty({
        description: '상대방 이름',
        required: true,
        example: '홍길동'
    })
    name?: string;

    @ApiProperty({
        description: '채팅메세지 리스트',
        type: [ChatMessageDataItem],
        required: true,
    })
    items?: ChatMessageDataItem[];

}