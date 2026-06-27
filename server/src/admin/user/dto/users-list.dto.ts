import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserStatus } from "../../../common/enum/users.enum";

export class UserListRequestDto {
    @ApiPropertyOptional({
        description: '페이지',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({
        description: '검색어(회사명/담당자/이메일 등)',
        example: '테크',
    })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({
        description: '페이지 크기',
        example: 20,
    })
    @IsOptional()
    @IsNumber()
    size?: number;

    @ApiPropertyOptional({
        description: '상태',
        enum: UserStatus,
        example: UserStatus.ACTIVE,
    })
    @ApiPropertyOptional({
        description: '정렬 컬럼',
        example: 'createdAt'
    })
    @IsOptional()
    @IsString()
    orderColumn?: string;

    @ApiPropertyOptional({
        description: '정렬 방식',
        example: 'DESC'
    })
    @IsOptional()
    @IsString()
    orderSort?: 'ASC' | 'DESC';
    
    @IsOptional()
    @IsEnum(UserStatus, { message: '유효하지 않은 상태 입니다.' })
    status?: UserStatus;
}