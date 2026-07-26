import { ApiProperty } from "@nestjs/swagger";

export class DisputeListItemDto {
    @ApiProperty({ example: 1 })
    id?: number;

    @ApiProperty({
        example: '환불이 안됩니다 - 환불 요청했는데 처리 안됨',
    })
    question?: string;

    @ApiProperty({
        example: '확인 후 처리 예정입니다.',
        required: false,
        nullable: true,
    })
    answer?: string | null;
}

export class DisputeListResponseDto {
    @ApiProperty({
        type: [DisputeListItemDto],
    })
    items?: DisputeListItemDto[];
}