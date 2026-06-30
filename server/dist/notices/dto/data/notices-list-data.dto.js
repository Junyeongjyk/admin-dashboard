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
exports.NoticesUserListResponseDto = exports.NoticesItem = void 0;
const swagger_1 = require("@nestjs/swagger");
const notices_enum_1 = require("../../../common/enum/notices.enum");
class NoticesItem {
    id;
    title;
    category;
    priority;
    reservedAt;
    createdAt;
}
exports.NoticesItem = NoticesItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 PK 번호',
        example: 1,
        required: true,
    }),
    __metadata("design:type", Number)
], NoticesItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 제목',
        example: '이용시 주의사항',
        required: true,
    }),
    __metadata("design:type", String)
], NoticesItem.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 유형',
        enum: notices_enum_1.NoticesCategory,
        example: notices_enum_1.NoticesCategory.NORMAL,
        required: true
    }),
    __metadata("design:type", String)
], NoticesItem.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 중요도',
        enum: notices_enum_1.NoticePriority,
        example: notices_enum_1.NoticePriority.NORMAL,
        required: true
    }),
    __metadata("design:type", String)
], NoticesItem.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 게시일',
        example: notices_enum_1.NoticesCategory.NORMAL,
        required: true
    }),
    __metadata("design:type", Object)
], NoticesItem.prototype, "reservedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 등록(게시일)',
        example: notices_enum_1.NoticesCategory.NORMAL,
        required: true
    }),
    __metadata("design:type", String)
], NoticesItem.prototype, "createdAt", void 0);
class NoticesUserListResponseDto {
    items;
}
exports.NoticesUserListResponseDto = NoticesUserListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 리스트',
        required: true,
        type: () => [NoticesItem]
    }),
    __metadata("design:type", Array)
], NoticesUserListResponseDto.prototype, "items", void 0);
//# sourceMappingURL=notices-list-data.dto.js.map