import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckIdentityRequestDto {

    @ApiProperty({
        description: '사용자 식별자 이메일 - 암호화 필요', 
        example: 'test@example.com',
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '이메일는 필수 입력값입니다.' })
    identity: string
    
    @ApiPropertyOptional({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
    })
    @IsString()
    @IsOptional()
    phoneNumber: string;

    @ApiHideProperty()
    @Allow()
    plainIdentity: string;

    @ApiHideProperty()
    @Allow()
    plainPhoneNumber: string;

}