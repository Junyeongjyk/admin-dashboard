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
exports.UserUpdatePasswordRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserUpdatePasswordRequestDto {
    identity;
    password;
    plainIdentity;
    plainPassword;
}
exports.UserUpdatePasswordRequestDto = UserUpdatePasswordRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '아이디 - 암호화 필요',
        example: 'test@example.com',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdatePasswordRequestDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '비밀번호 8~20자 특수문자 2개이상 포함 - 암호화 필요 - sns 가입시 공백 ',
        example: 'P@ssw0rd!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '비밀번호는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], UserUpdatePasswordRequestDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdatePasswordRequestDto.prototype, "plainIdentity", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], UserUpdatePasswordRequestDto.prototype, "plainPassword", void 0);
//# sourceMappingURL=users-update-password.dto.js.map