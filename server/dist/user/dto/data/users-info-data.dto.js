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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const users_enum_1 = require("../../../common/enum/users.enum");
class UserInfoResponseDto {
    id;
    identity;
    name;
    address;
    detailAddress;
    zipcode;
    isNotificationAgreed;
    nickname;
    userType;
    email;
    phone;
    isEmailVerified;
    gender;
}
exports.UserInfoResponseDto = UserInfoResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '유저(파트너) ID',
        example: 1,
        required: true
    }),
    __metadata("design:type", Number)
], UserInfoResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '아이디 - 복호화 필요',
        example: 'test@test.com',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '성명 - 복호화 필요',
        example: '홍길동',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '주소 - 복호화 필요',
        example: '서울특별시 ....',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상세주소',
        example: '서울특별시 ....',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "detailAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '우편번호 - 복호화 필요',
        example: '12345',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "zipcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '알람 수신여부',
        example: false,
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "isNotificationAgreed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '파트너 닉네임',
        example: '홍길동 || null',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 유형',
        example: 'USER',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '이메일 주소 - 복호화 필요',
        example: 'test@test.com',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '연락처 - 복호화 필요',
        example: '01012345678',
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '메일 인증여부',
        example: false,
        required: true
    }),
    __metadata("design:type", Boolean)
], UserInfoResponseDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '성별',
        example: users_enum_1.Gender.MALE,
        required: true
    }),
    __metadata("design:type", String)
], UserInfoResponseDto.prototype, "gender", void 0);
//# sourceMappingURL=users-info-data.dto.js.map