import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordComfirmRequestDto {

    @ApiProperty({
        description: '비밀번호 8~20자 특수문자 2개이상 포함 - 암호화 필요',
        example: 'P@ssw0rd!',
    }) 
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
    password: string;

    @ApiProperty({
        description: '사용자 식별자 이메일 - 암호화 필요', 
        example: 'test@example.com',
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '이메일는 필수 입력값입니다.' })
    identity: string
    
    @ApiHideProperty()
    @Allow()
    plainIdentity: string;

    @ApiHideProperty()
    @Allow()
    plainPassword: string;

}