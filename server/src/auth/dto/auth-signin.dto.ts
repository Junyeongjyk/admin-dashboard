import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SignupPath } from "../../common/enum/users.enum";

export class SigninRequestDto {
    @ApiProperty({
        description: '사용자 아이디(이메일) - 암호화 필요', 
        example: 'test@example.com',
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '이메일는 필수 입력값입니다.' })
    identity: string;

    @ApiProperty({
        description: '비밀번호- 암호화 필요',
        example: 'P@ssw0rd!',
        required: true
    }) 
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
    password: string;

    @ApiProperty({
        description: '가입경로',
        enum: SignupPath, 
        example: SignupPath.NORMAL, 
        required: true,
    })
    @IsEnum(SignupPath, { message: '유효하지 않은 가입경로유형입니다.' })
    provider: SignupPath
    
    @ApiProperty({
        description: '접속 디바이스Id',
        example: 'WEB_1234', 
        required: true,
    })
    @IsString()
    deviceId: string;

    @ApiProperty({
        description: '모바일 App 로그인시 App에대한 uuid',
        example: '1233-1234-1234-1234',
    }) 
    @IsString()
    @IsOptional()
    uuid: string;

    @ApiHideProperty()
    @Allow()
    plainIdentity: string;
    
    @ApiHideProperty()
    @Allow()
    plainPassword: string;

    @ApiHideProperty()
    @Allow()
    plainProviderUserId:string;
}