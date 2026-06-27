import { ApiProperty } from "@nestjs/swagger";
import { NoticesCategory } from "../../../common/enum/notices.enum";

export class FaqsItem {

    @ApiProperty({
        description: 'FAQ PK 번호', 
        example: 1,
        required:true, 
    })
    id: number

    @ApiProperty({
        description: '질문', 
        example: 'App  로그인시 로그인이 안되요',
        required:true, 
    })
    question: string

    @ApiProperty({
        description: '답변',
        example: '네트워크 연결 확인', 
        required: true
    })
    answer: string;
}

export class FaqsListResponseDto {
    @ApiProperty({
        description: 'FAQ 리스트', 
        required:true, 
        type: () => [FaqsItem]
    })
    items: FaqsItem[]
}