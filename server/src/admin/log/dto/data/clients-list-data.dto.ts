import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserStatus } from "../../../../common/enum/users.enum";


class UserItem {
    @ApiProperty({ description: '유저 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '가입/생성일', example: '2026-01-01 01:01:01' })
    createdAt: string;

    @ApiProperty({
        description: '상태',
        enum: UserStatus,
        example: UserStatus.ACTIVE,
    })

    status: UserStatus;
}

class PageMeta {
    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 20 })
    size: number;

    @ApiProperty({ example: 132 })
    totalCount: number;

    @ApiProperty({ example: 7 })
    totalPages: number;

    @ApiProperty({ example: true })
    hasNext: boolean;
}

export class UserListResponseDto {
    @ApiProperty({
        description: '유저 목록',
        type: [UserItem],
        example: [
            {
                id: 'cli_123',
                createdAt: '2026-01-01 01:01:01',
                status: 'ACTIVE',
            },
        ],
    })
    items: UserItem[];

    @ApiProperty({
        description: '페이지 정보',
        type: PageMeta,
        example: {
            page: 1,
            size: 20,
            totalCount: 132,
            totalPages: 7,
            hasNext: true,
        },
    })
    page: PageMeta;
}