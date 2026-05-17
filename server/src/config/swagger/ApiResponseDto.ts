import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
    @ApiProperty({ example: 1, description: '성공(1) / 실패(0)' })
    status: number;

    @ApiProperty({ example: 'SUCCESS', description: '서비스 응답 코드' })
    code: string;

    @ApiProperty({ example: '요청 성공', description: '메시지' })
    message: string;

    @ApiProperty({ description: '응답 데이터' })
    data: T;
}