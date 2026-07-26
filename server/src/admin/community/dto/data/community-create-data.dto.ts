import { ApiProperty } from "@nestjs/swagger";


export class  CommunityCreateResponseDto {
    @ApiProperty({
        description: '게시물 ID',
        example: 1,
        required: true,
    })
    postId?: number;

    @ApiProperty({
        description: '생성 시각',
        example: '2026-01-01 01:01:01',
        required: true,
    })
    createdAt?: string;
}