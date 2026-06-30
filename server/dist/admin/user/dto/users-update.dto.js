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
exports.UserUpdateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const users_enum_1 = require("../../common/enum/users.enum");
class UserUpdateRequestDto {
    email;
    address;
    detailAddress;
    zipCode;
    phone;
    notification;
    twoFactor;
    gender;
    plainEmail;
    plainAddress;
    plainZipCode;
    plainPhone;
}
exports.UserUpdateRequestDto = UserUpdateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이메일 - 암호화 필요',
        example: 'test@example.com',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '주소 (도로명 또는 지번) - 암호화 필요',
        example: '서울특별시 강남구 테헤란로 123',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '주소는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '상세 주소 (동·호수 등)',
        example: '101동 1001호',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '상세주소는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "detailAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '우편번호 (5자리) - 암호화 필요',
        example: '06236',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '우편번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '휴대폰 번호 (숫자만 입력) - 암호화 필요',
        example: '01012345678',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '전화번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '앎람 수신여부',
        example: false,
        required: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: '알람 수신여부 필수값입니다.' }),
    __metadata("design:type", Boolean)
], UserUpdateRequestDto.prototype, "notification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '2차 인증 사용여부',
        example: false,
        required: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)({ message: '2차 인증 사용여부 필수값입니다.' }),
    __metadata("design:type", Boolean)
], UserUpdateRequestDto.prototype, "twoFactor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '성별',
        example: users_enum_1.Gender.MALE,
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '성별는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "plainEmail", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "plainAddress", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "plainZipCode", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdateRequestDto.prototype, "plainPhone", void 0);
//# sourceMappingURL=users-update.dto.js.map