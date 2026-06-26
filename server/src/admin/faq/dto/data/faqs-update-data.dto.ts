import { ApiProperty } from "@nestjs/swagger";

export class FaqsUpdateResponseDto {

    @ApiProperty({
        description: 'FAQ ID',
        example: 1,
        required: true,
    })
    faqId: number;

    @ApiProperty({
        description: '갱신 시각',
        example: '2025-12-31 12:00:00',
        required: true,
    })
    updatedAt: string;
}