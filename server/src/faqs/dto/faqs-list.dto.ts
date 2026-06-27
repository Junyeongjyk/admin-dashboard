import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FaqsListRequestDto {

    @ApiProperty({
        description: 'FAQ 유형',
        example: '결제', 
    })
    @IsString()
    @IsOptional()
    category: string;

    @ApiProperty({
        description: '검색어',
        example: '로그인 실패', 
    })
    @IsString()
    @IsOptional()
    keyword: string;
}