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
exports.UserListResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const users_enum_1 = require("../../../../common/enum/users.enum");
class UserItem {
    id;
    createdAt;
    status;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '유저 ID', example: 1 }),
    __metadata("design:type", Number)
], UserItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '가입/생성일', example: '2026-01-01 01:01:01' }),
    __metadata("design:type", String)
], UserItem.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '상태',
        enum: users_enum_1.UserStatus,
        example: users_enum_1.UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], UserItem.prototype, "status", void 0);
class PageMeta {
    page;
    size;
    totalCount;
    totalPages;
    hasNext;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PageMeta.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    __metadata("design:type", Number)
], PageMeta.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 132 }),
    __metadata("design:type", Number)
], PageMeta.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7 }),
    __metadata("design:type", Number)
], PageMeta.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PageMeta.prototype, "hasNext", void 0);
class UserListResponseDto {
    items;
    page;
}
exports.UserListResponseDto = UserListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '유저 목록',
        type: [UserItem],
        example: [
            {
                id: 'cli_123',
                createdAt: '2026-01-01 01:01:01',
                status: 'ACTIVE',
            },
        ],
    }),
    __metadata("design:type", Array)
], UserListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '페이지 정보',
        type: PageMeta,
        example: {
            page: 1,
            size: 20,
            totalCount: 132,
            totalPages: 7,
            hasNext: true,
        },
    }),
    __metadata("design:type", PageMeta)
], UserListResponseDto.prototype, "page", void 0);
//# sourceMappingURL=clients-list-data.dto.js.map