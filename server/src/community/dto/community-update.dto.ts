import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommunityPostType } from "../../common/enum/community.eum";

export class CommunityUserUpdateRequestDto {

    @ApiProperty({
        description: '게시물 ID',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty({ message: '게시물 ID는 필수 입력값입니다.' })
    postId: number;

    @ApiProperty({
        description: '제목',
        example: '제목을 수정합니다.',
    })
    @IsString()
    @IsNotEmpty({ message: '게시물 제목은 필수 입력값입니다.' })
    title: string;

    @ApiProperty({
        description: '내용',
        example: '내용을 수정합니다.',
    })
    @IsString()
    @IsNotEmpty({ message: '게시물 내용은 필수 입력값입니다.' })
    content: string;

    @ApiProperty({
        description: '게시물 내용 유형(카테고리)',
        enum: CommunityPostType,
        example: CommunityPostType.QUESTION,
        required: true,
    })
    @IsEnum(CommunityPostType, { message: '유효하지 않은 카테고리입니다.' })
    category: CommunityPostType;
    
}