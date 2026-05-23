import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Allow, IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Matches, Min } from 'class-validator';
import { Gender, SignupPath, SignupType, UserType } from "../../common/enum/users.enum";
import { Transform } from "class-transformer";
import { RequestCategory } from "../../common/enum/category.enum";

export class SignupRequestDto {

    @ApiProperty({
        description: '가입유형',
        enum: SignupType, 
        example: SignupType.CLIENT, 
        required: true,
    })
    @IsEnum(SignupType, { message: '유효하지 않은 가입유형입니다.' })
    userType: UserType;

    @ApiProperty({
        description: '가입경로',
        enum: SignupPath, 
        example: SignupPath.NORMAL, 
        required: true,
    })
    @IsEnum(SignupPath, { message: '유효하지 않은 가입경로유형입니다.' })
    provider: SignupPath

    @ApiProperty({ 
        description: '사용자 식별자 이메일 - 암호화 필요 - sns 가입시 공백 ', 
        example: 'test@example.com',
        required:true, 
    })
    @IsString()
    @IsNotEmpty({ message: '이메일는 필수 입력값입니다.' })
    identity: string

    @ApiProperty({
        description: '비밀번호 8~20자 특수문자 2개이상 포함 - 암호화 필요 - sns 가입시 공백 ',
        example: 'P@ssw0rd!',
    }) 
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
    password: string;

    @ApiProperty({
        description: '이름 - 암호화 필요',
        example: '홍길동',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
    name: string;

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
    zipCode: string;

    @ApiProperty({
        description: '생년월일 (YYYY-MM-DD)',
        example: '1990-05-21',
        required: true
    })
    @IsNotEmpty({ message: '생년월일은 필수 입력값입니다.' })
    @IsDateString({}, { message: '올바른 날짜 형식이 아닙니다.' })
    birthDate: string;

    @ApiProperty({
        description: '성별 (MALE: 남성, FEMALE: 여성)',
        enum: Gender,
        example: Gender.MALE,
        required: true
    })
    @IsEnum(Gender, { message: '성별는 MALE 또는 FEMALE만 가능합니다.' })
    @IsNotEmpty({ message: '성별는 필수 입력값입니다.' })
    gender: Gender; 

    @ApiProperty({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '전화번호는 필수 입력값입니다.' })
    phoneNumber: string;

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const v = value.toLowerCase();
            if (v === 'true') return true;
            if (v === 'false') return false;
        }
        return value; // 검증에서 걸리게 그대로 둠
    })
    @ApiPropertyOptional({
        description: '마케팅 정보 수신 동의 여부 (미동의 시 false)',
        example: true,
        default: false,
    })
    @IsBoolean({ message: '마케팅 수신여부는 true 또는 false여야 합니다.' })
    @IsOptional()
    marketingAgreed?: boolean;



    // 탐정 프로필 정보
    @ApiPropertyOptional({
        description: '탐정회원 프로필 사진 - 탐정가입시 필수',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    profileImage: any;

    @ApiPropertyOptional({
        description: '탐정회원 자격증 사진 - 탐정가입시 필수',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    licenseImage: any;


    @ApiPropertyOptional({
        description: '상호명 (개인/법인 사업자) - 탐정가입시 필수',
        example: '홍길동상사',
    })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiPropertyOptional({
        description: '사업자등록번호 (숫자 10자리 또는 하이픈 포함) - 탐정가입시 필수',
        example: '123-45-67890',
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{3}-?\d{2}-?\d{5}$/, {
        message: '사업자등록번호는 10자리 숫자 형식이어야 합니다.',
    })
    businessRegistrationNumber?: string;

    @ApiPropertyOptional({
        description: '사업자등록증 이미지 (jpg, png, pdf) - 탐정가입시 필수',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    businessRegistrationImage?: any;

    @ApiPropertyOptional({
        description: '사업자 주소 (도로명 또는 지번) - 탐정가입시 필수',
        example: '서울특별시 강남구 테헤란로 123',
    })
    @IsOptional()
    @IsString()
    businessAddress?: string;

    @ApiPropertyOptional({
        description: '사업자 상세주소 (동·호수 등) - 탐정가입시 필수',
        example: '101동 1001호',
    })
    @IsOptional()
    @IsString()
    businessDetailAddress?: string;

    @ApiPropertyOptional({
        description: '사업자 대표자명  - 탐정가입시 필수',
        example: '홍길동',
    })
    @IsOptional()
    @IsString()
    businessCeo?: string;

    @ApiPropertyOptional({
        description: '사업자 우편번호 (5자리) - 탐정가입시 필수',
        example: '06236',
        minLength: 5,
        maxLength: 5,
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{5}$/, {
        message: '사업자 우편번호는 숫자 5자리여야 합니다.',
    })
    businessZipCode?: string;


    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiPropertyOptional({
        description: '경력 연수 (년 단위) - 탐정가입시 필수',
        example: 5,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: '경력 연수는 0 이상이어야 합니다.' })
    careerYears?: number;

    @ApiPropertyOptional({
        description: '주 활동 지역 - 탐정가입시 필수',
        example: '서울특별시',
    })
    @IsOptional()
    @IsString()
    mainActivityRegion?: string;

    @ApiPropertyOptional({
        description: '황동명 - 미등록시 실성명 등록',
        example: '홍길동',
    })
    @IsOptional()
    @IsString()
    nickname?: string;

    @ApiPropertyOptional({
        description: '전문분야 - 탐정가입시 필수',
        enum: RequestCategory, 
        example: RequestCategory.AGREEMENT_DIVORCE_PROPERTY, 
    })
    @IsOptional()
    @IsEnum(RequestCategory, { message: '유효하지 않은 전문분야입니다.' })
    introduction: RequestCategory;

    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    })
    @ApiPropertyOptional({
        description: '최소수임 - 탐정가입시 필수',
        example: 10000000, 
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: '최소수임료는 0 이상이어야 합니다.' })
    fee: number;


    @ApiHideProperty()
    @Allow()
    plainIdentity: string;
    @ApiHideProperty()
    @Allow()
    plainPassword: string;
    @ApiHideProperty()
    @Allow()
    plainName: string;
    @ApiHideProperty()
    @Allow()
    plainAddress: string;
    @ApiHideProperty()
    @Allow()
    plainDetailAddress: string;
    @ApiHideProperty()
    @Allow()
    plainZipCode: string;
    @ApiHideProperty()
    @Allow()
    plainPhoneNumber: string;

    @ApiHideProperty()
    @Allow()
    plainProviderUserId:string;
    @ApiHideProperty()
    @Allow()
    plainEmail: string
    @ApiHideProperty()
    @Allow()
    plainProfileImageUrl:string
    
}   