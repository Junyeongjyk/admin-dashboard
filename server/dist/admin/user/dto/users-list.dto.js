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
exports.UserListRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const users_enum_1 = require("../../../common/enum/users.enum");
class UserListRequestDto {
    page;
    q;
    size;
    orderColumn;
    orderSort;
    status;
}
exports.UserListRequestDto = UserListRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '페이지',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserListRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '검색어(회사명/담당자/이메일 등)',
        example: '테크',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserListRequestDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '페이지 크기',
        example: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserListRequestDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상태',
        enum: users_enum_1.UserStatus,
        example: users_enum_1.UserStatus.ACTIVE,
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: '정렬 컬럼',
        example: 'createdAt'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserListRequestDto.prototype, "orderColumn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '정렬 방식',
        example: 'DESC'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserListRequestDto.prototype, "orderSort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.UserStatus, { message: '유효하지 않은 상태 입니다.' }),
    __metadata("design:type", String)
], UserListRequestDto.prototype, "status", void 0);
//# sourceMappingURL=users-list.dto.js.map