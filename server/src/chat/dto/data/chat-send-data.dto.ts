import { ApiProperty } from "@nestjs/swagger";


export class ChatSendResponseDto {
 
    @ApiProperty({
        description: '채팀 룸ID',
        example: 1,
        required: true,
    })
    roomId;


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

    @ApiProperty({
        description: '파일 오리지널 명',
        required: true
    })
    originalName?: string | null;

    @ApiProperty({
        description: '미디어 타입',
        required: true,
    })
    mimeType?: string | null;

    @ApiProperty({
        description: '용량',
        required: true,
    })
    size?: number | null;

    @ApiProperty({
        description: '메세지가 텍스트인지 파일인지 여부',
        required: true,
    })
    chatContentType?: boolean
}