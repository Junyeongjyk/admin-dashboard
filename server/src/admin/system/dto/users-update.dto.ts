import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsBoolean, IsNotEmpty, IsString, Matches } from "class-validator";
import { Gender } from "../../common/enum/users.enum";

export class UserUpdateRequestDto {

    @ApiProperty({
        description: '이메일 - 암호화 필요', 
        example: 'test@example.com',
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '이메일는 필수 입력값입니다.' })
    email: string

    @ApiProperty({
        description: '주소 (도로명 또는 지번) - 암호화 필요',
        example: '서울특별시 강남구 테헤란로 123',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '주소는 필수 입력값입니다.' })
    address: string;

    @ApiProperty({
        description: '상세 주소 (동·호수 등)',
        example: '101동 1001호',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '상세주소는 필수 입력값입니다.' })
    detailAddress: string;

    @ApiProperty({
        description: '우편번호 (5자리) - 암호화 필요',
        example: '06236',
    })
    @IsString()
    @IsNotEmpty({ message: '우편번호는 필수 입력값입니다.' })
    zipCode: string

    @ApiProperty({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '전화번호는 필수 입력값입니다.' })
    phone: string;

    @ApiProperty({
        description: '앎람 수신여부',
        example: false,
        required: true
    })
    @IsBoolean()
    @IsNotEmpty({ message: '알람 수신여부 필수값입니다.' })
    notification: boolean;

    @ApiProperty({
        description: '2차 인증 사용여부',
        example: false,
        required: true
    })
    @IsBoolean()
    @IsNotEmpty({ message: '2차 인증 사용여부 필수값입니다.' })
    twoFactor: boolean;

    @ApiProperty({
        description: '성별', 
        example: Gender.MALE,
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '성별는 필수 입력값입니다.' })
    gender: string

    @ApiHideProperty()
    @Allow()
    plainEmail: string;
    
    @ApiHideProperty()
    @Allow()
    plainAddress: string;
    
    @ApiHideProperty()
    @Allow()
    plainZipCode: string;

    @ApiHideProperty()
    @Allow()
    plainPhone: string;

}