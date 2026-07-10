import { ApiProperty } from "@nestjs/swagger";

export class ChatListDataItem {
    @ApiProperty({
        description: '파트너 등록 아이디',
        example: 1,
        required: true,
    })
    id?: number;

    @ApiProperty({
        description: '파트너 이름',
        example: '홍길동',
        required: true,
    })
    name?: string;

    @ApiProperty({
        description: '파트너 닉네임',
        example: '홍길동',
    })
    nickname?: string;

    @ApiProperty({
        description: '채팅 룸 번호',
        example: 1
    })
    roomId? : number | null;
}

export class ChatListDataResponseDto {
 

    @ApiProperty({
        description: '채팅상대 리스트',
        type: [ChatListDataItem],
        required: true,
    })
    items?: ChatListDataItem[];

}