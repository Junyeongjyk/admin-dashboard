import { ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "../../../common/enum/users.enum";

export class UsersInfoResponseDto {

    @ApiPropertyOptional({
        description: '유저(파트너) ID',
        example: 1,
        required: true
    })
    id: number

    @ApiPropertyOptional({
        description: '아이디 - 복호화 필요',
        example: 'test@test.com',
        required: true
    })
    identity: string;

    @ApiPropertyOptional({
        description: '성명 - 복호화 필요',
        example: '홍길동',
        required: true
    })
    name: string;

    @ApiPropertyOptional({
        description: '주소 - 복호화 필요',
        example: '서울특별시 ....',
        required: true
    })
    address: string;

    @ApiPropertyOptional({
        description: '상세주소',
        example: '서울특별시 ....',
        required: true
    })
    detailAddress: string;

    @ApiPropertyOptional({
        description: '우편번호 - 복호화 필요',
        example: '12345',
        required: true
    })
    zipcode: string;
    

    @ApiPropertyOptional({
        description: '알람 수신여부',
        example: false,
        required: true
    })
    isNotificationAgreed: string;


    @ApiPropertyOptional({
        description: '파트너 닉네임',
        example: '홍길동 || null',
        required: true
    })
    nickname: string;

    @ApiPropertyOptional({
        description: '사용자 유형',
        example: 'USER',
        required: true
    })
    userType: string;

    @ApiPropertyOptional({
        description: '이메일 주소 - 복호화 필요',
        example: 'test@test.com',
        required: true
    })
    email: string;

    @ApiPropertyOptional({
        description: '연락처 - 복호화 필요',
        example: '01012345678',
        required: true
    })
    phone: string;


    @ApiPropertyOptional({
        description: '메일 인증여부',
        example: false,
        required: true
    })
    isEmailVerified:boolean;

    @ApiPropertyOptional({
        description: '성별',
        example: Gender.MALE,
        required: true
    })
    gender:string;
}