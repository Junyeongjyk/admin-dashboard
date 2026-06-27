import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { NoticesItem } from "./notices-list-data.dto";


export class NoticesUserDetailResponseDto extends NoticesItem{

    @ApiProperty({
        description: '공지사항 내용', 
        example: '이용수칙.......',
        required: true
    })
    content: string

    // @ApiProperty({
    //     description: '첨부파일 리스트', 
    //     example:  1,
    //     type: () => AttachmentsItem
    // })
    // @IsOptional()
    // attachments: string

}