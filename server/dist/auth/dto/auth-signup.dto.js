"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const users_enum_1 = require("../../common/enum/users.enum");
const class_transformer_1 = require("class-transformer");
const category_enum_1 = require("../../common/enum/category.enum");
class SignupRequestDto {
    userType;
    provider;
    identity;
    password;
    name;
    address;
    detailAddress;
    zipCode;
    birthDate;
    gender;
    phoneNumber;
    marketingAgreed;
    // 파트너 프로필 정보
    profileImage;
    licenseImage;
    businessName;
    businessRegistrationNumber;
    businessRegistrationImage;
    businessAddress;
    businessDetailAddress;
    businessCeo;
    businessZipCode;
    careerYears;
    mainActivityRegion;
    nickname;
    introduction;
    fee;
    plainIdentity;
    plainPassword;
    plainName;
    plainAddress;
    plainDetailAddress;
    plainZipCode;
    plainPhoneNumber;
    plainProviderUserId;
    plainEmail;
    plainProfileImageUrl;
}
exports.SignupRequestDto = SignupRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '가입유형',
        enum: users_enum_1.SignupType,
        example: users_enum_1.SignupType.CLIENT,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(users_enum_1.SignupType, { message: '유효하지 않은 가입유형입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '가입경로',
        enum: users_enum_1.SignupPath,
        example: users_enum_1.SignupPath.NORMAL,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(users_enum_1.SignupPath, { message: '유효하지 않은 가입경로유형입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 식별자 이메일 - 암호화 필요 - sns 가입시 공백 ',
        example: 'test@example.com',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '비밀번호 8~20자 특수문자 2개이상 포함 - 암호화 필요 - sns 가입시 공백 ',
        example: 'P@ssw0rd!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '비밀번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이름 - 암호화 필요',
        example: '홍길동',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이름은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '주소 (도로명 또는 지번) - 암호화 필요',
        example: '서울특별시 강남구 테헤란로 123',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '주소는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '상세 주소 (동·호수 등)',
        example: '101동 1001호',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '상세주소는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "detailAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '우편번호 (5자리) - 암호화 필요',
        example: '06236',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '우편번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '생년월일 (YYYY-MM-DD)',
        example: '1990-05-21',
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '생년월일은 필수 입력값입니다.' }),
    (0, class_validator_1.IsDateString)({}, { message: '올바른 날짜 형식이 아닙니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '성별 (MALE: 남성, FEMALE: 여성)',
        enum: users_enum_1.Gender,
        example: users_enum_1.Gender.MALE,
        required: true
    }),
    (0, class_validator_1.IsEnum)(users_enum_1.Gender, { message: '성별는 MALE 또는 FEMALE만 가능합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '성별는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '전화번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const v = value.toLowerCase();
            if (v === 'true')
                return true;
            if (v === 'false')
                return false;
        }
        return value; // 검증에서 걸리게 그대로 둠
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '마케팅 정보 수신 동의 여부 (미동의 시 false)',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsBoolean)({ message: '마케팅 수신여부는 true 또는 false여야 합니다.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SignupRequestDto.prototype, "marketingAgreed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '파트너회원 프로필 사진 - 파트너가입시 필수',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SignupRequestDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '파트너회원 자격증 사진 - 파트너가입시 필수',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SignupRequestDto.prototype, "licenseImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상호명 (개인/법인 사업자) - 파트너가입시 필수',
        example: '홍길동상사',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자등록번호 (숫자 10자리 또는 하이픈 포함) - 파트너가입시 필수',
        example: '123-45-67890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{3}-?\d{2}-?\d{5}$/, {
        message: '사업자등록번호는 10자리 숫자 형식이어야 합니다.',
    }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessRegistrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자등록증 이미지 (jpg, png, pdf) - 파트너가입시 필수',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SignupRequestDto.prototype, "businessRegistrationImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자 주소 (도로명 또는 지번) - 파트너가입시 필수',
        example: '서울특별시 강남구 테헤란로 123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자 상세주소 (동·호수 등) - 파트너가입시 필수',
        example: '101동 1001호',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessDetailAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자 대표자명  - 파트너가입시 필수',
        example: '홍길동',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessCeo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사업자 우편번호 (5자리) - 파트너가입시 필수',
        example: '06236',
        minLength: 5,
        maxLength: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{5}$/, {
        message: '사업자 우편번호는 숫자 5자리여야 합니다.',
    }),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "businessZipCode", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '경력 연수 (년 단위) - 파트너가입시 필수',
        example: 5,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: '경력 연수는 0 이상이어야 합니다.' }),
    __metadata("design:type", Number)
], SignupRequestDto.prototype, "careerYears", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '주 활동 지역 - 파트너가입시 필수',
        example: '서울특별시',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "mainActivityRegion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '황동명 - 미등록시 실성명 등록',
        example: '홍길동',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '전문분야 - 파트너가입시 필수',
        enum: category_enum_1.RequestCategory,
        example: category_enum_1.RequestCategory.AGREEMENT_DIVORCE_PROPERTY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(category_enum_1.RequestCategory, { message: '유효하지 않은 전문분야입니다.' }),
    __metadata("design:type", typeof (_a = typeof category_enum_1.RequestCategory !== "undefined" && category_enum_1.RequestCategory) === "function" ? _a : Object)
], SignupRequestDto.prototype, "introduction", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '최소수임 - 파트너가입시 필수',
        example: 10000000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: '최소수임료는 0 이상이어야 합니다.' }),
    __metadata("design:type", Number)
], SignupRequestDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainIdentity", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainPassword", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainName", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainAddress", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainDetailAddress", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainZipCode", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainPhoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainProviderUserId", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainEmail", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], SignupRequestDto.prototype, "plainProfileImageUrl", void 0);
//# sourceMappingURL=auth-signup.dto.js.map