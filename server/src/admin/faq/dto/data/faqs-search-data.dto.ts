import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { FaqCategory } from "../../../../common/enum/faq.enum";

class FaqListItem {
  @ApiProperty({ description: 'FAQ ID', example: 1 })
  faqId: number;

  @ApiProperty({ description: '카테고리', enum: FaqCategory, example: FaqCategory.PAYMENT })
  category: FaqCategory;

  @ApiProperty({ description: '질문', example: '환불은 어떻게 하나요?' })
  question: string;

  @ApiProperty({ description: '공개 여부', example: true })
  isPublished: boolean;

  @ApiProperty({ description: '노출 순서', example: 1 })
  orderNo: number;
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

export class FaqsSearchResponseDto {

    @ApiProperty({
        description: 'FAQ 목록',
        type: [FaqListItem],
        example: [
            {
                faqId: 1,
                category: 'PAYMENT',
                question: '환불은 어떻게 하나요?',
                isPublished: true,
                orderNo: 1,
            },
        ],
    })
    items: FaqListItem[];

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