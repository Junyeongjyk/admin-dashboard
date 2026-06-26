import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FaqsDeleteRequestDto {

    @ApiProperty({
        description: 'FAQ ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: 'FAQ ID는 필수 입력값입니다.' })
    faqId: number;

    @ApiPropertyOptional({
        description: '삭제 사유',
        example: '중복 FAQ',
    })
    @IsOptional()
    @IsString()
    reason?: string;

}