import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString , IsNumber} from "class-validator";
import { NoticesCategory } from "../../../common/enum/notices.enum";

export class NoticesListRequestDto {

    @ApiProperty({
        description: '공지사항 유형',
        enum: NoticesCategory, 
        example: NoticesCategory.NORMAL, 
    })
    @IsString()
    @IsOptional()
    category: string;
    
    @ApiProperty({
        description: '현재 페이지',
        example: '1',
        required: true
    })
    @IsNumber()
    @IsOptional()
    page: number;

    @ApiProperty({
        description: '리스트 수',
        example: '20',
        required: true
    })
    @IsNumber()
    @IsOptional()
    size: number;

}