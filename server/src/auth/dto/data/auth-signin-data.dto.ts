import { ApiProperty } from "@nestjs/swagger";
import { SignupType, UserType } from "../../../common/enum/user.enum";

export class SigninResponseDto {
    
    @ApiProperty({
        description: '사용자 ID',
        example: 1,
    }) 
    id?: number;

    @ApiProperty({
        description: '사용자 성명 - 복호화 필요',
        example: '홍길동',
    }) 
    name?: string;


    @ApiProperty({
        description: '가입유형',
        enum: SignupType, 
        example: SignupType.USER, 
        required: true,
    })
    userType?: UserType;

    @ApiProperty({
        description: 'mqtt 소켓 아이디 - 복호화 필요',
        example: 'WEB_1234', 
        required: true,
    })
    clientId?: string

    @ApiProperty({
        description: 'mqtt 소켓 접속 username - 복호화 필요',
        example: 'WEB_1234', 
        required: true,
    })
    username?: string

    @ApiProperty({
        description: 'mqtt 소켓 접속 패스워드 - 복호화 필요',
        example: 'WEB_1234', 
        required: true,
    })
    password?: string

    @ApiProperty({
        description: '2차인증 진행 여부',
        example: true, 
        required: true,
    })
    isTwoFactorEnabled?: boolean

}