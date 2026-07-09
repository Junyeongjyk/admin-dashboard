import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsString } from "class-validator";

export class recoverIdentityRequestDto {

    @ApiProperty({
        description: '이름 - 암호화 필요',
        example: '홍길동',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
    name: string;
    
    @ApiProperty({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '전화번호는 필수 입력값입니다.' })
    phoneNumber: string;


    @ApiHideProperty()
    @Allow()
    plainName: string;

    @ApiHideProperty()
    @Allow()
    plainPhoneNumber: string;

}