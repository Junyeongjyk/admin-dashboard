import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommunityPostType } from "../../common/enum/community.eum";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CommunityUserCreateRequestDto {

    @ApiProperty({
        description: '게시물 내용 유형(카테고리)',
        enum: CommunityPostType,
        example: CommunityPostType.QUESTION,
        required: true,
    })
    @IsEnum(CommunityPostType, { message: '유효하지 않은 카테고리입니다.' })
    category: CommunityPostType;

    @ApiProperty({
        description: '제목',
        example: '이 기능 써보신 분 계신가요?',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: 'title은 필수 입력값입니다.' })
    title: string;

    @ApiProperty({
        description: '내용',
        example: '경험 공유 부탁드립니다.',
        required: true,
    })
    @IsString()
    @IsNotEmpty({ message: '내용은 필수 입력값입니다.' })
    content: string;

    // @ApiPropertyOptional({
    //     description: '첨부파일 ID 목록 (파일업로드 API로 업로드 후 file_id 전달)',
    //     example: [1, 2],
    //     type: [Number],
    // })
    // @IsOptional()
    // @IsArray()
    // @IsNumber({}, { each: true })
    // attachments?: number[];

    @ApiPropertyOptional({
        description: '익명 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isAnonymous?: boolean;

}