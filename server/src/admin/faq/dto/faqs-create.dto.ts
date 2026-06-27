import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FaqCategory } from "../../../common/enum/faq.enum";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FaqsCreateRequestDto {
    @ApiProperty({
        description: '카테고리',
        enum: FaqCategory,
        example: FaqCategory.PAYMENT,
        required: true,
    })
    @IsEnum(FaqCategory, { message: '유효하지 않은 카테고리 입니다.' })
    category: FaqCategory;

    @ApiProperty({
        description: '질문',
        example: '환불은 어떻게 하나요?',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '질문은 필수 입력값입니다.' })
    question: string;

    @ApiProperty({
        description: '답변',
        example: '환불은 결제 내역에서 신청할 수 있습니다.',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '답변는 필수 입력값입니다.' })
    answer: string;

    @ApiPropertyOptional({
        description: '공개 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiPropertyOptional({
        description: '노출 순서',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    orderNo?: number;
}