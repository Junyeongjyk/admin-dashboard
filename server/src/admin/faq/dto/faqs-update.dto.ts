import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FaqCategory } from "../../../common/enum/faq.enum";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FaqsUpdateRequestDto {

    @ApiProperty({
        description: 'FAQ ID',
        example: 1,
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: 'FAQ ID는 필수 입력값입니다.' })
    faqId: number;

    @ApiPropertyOptional({
        description: '카테고리',
        enum: FaqCategory,
        example: FaqCategory.PAYMENT,
    })
    @IsOptional()
    @IsEnum(FaqCategory, { message: '유효하지 않은 카테고리 입니다.' })
    category?: FaqCategory;

    @ApiPropertyOptional({
        description: '질문',
        example: '환불은 어떻게 하나요?',
    })
    @IsOptional()
    @IsString()
    question?: string;

    @ApiPropertyOptional({
        description: '답변',
        example: '결제 내역에서 환불 신청이 가능합니다.',
    })
    @IsOptional()
    @IsString()
    answer?: string;

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