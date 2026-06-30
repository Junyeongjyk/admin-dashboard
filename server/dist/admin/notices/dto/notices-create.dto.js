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
exports.NoticesCreateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const notices_enum_1 = require("../../../common/enum/notices.enum");
class NoticesCreateRequestDto {
    category;
    target;
    required;
    priority;
    title;
    content;
    attachments;
    publishedAt;
}
exports.NoticesCreateRequestDto = NoticesCreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지 카테고리',
        enum: notices_enum_1.NoticesCategory,
        example: notices_enum_1.NoticesCategory.SYSTEM,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(notices_enum_1.NoticesCategory, { message: '유효하지 않은 카테고리 입니다.' }),
    __metadata("design:type", String)
], NoticesCreateRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "대상('PARTNER'|'USER'|'ALL')",
        enum: notices_enum_1.NoticeTarget,
        example: notices_enum_1.NoticeTarget.ALL,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(notices_enum_1.NoticeTarget, { message: '유효하지 않은 대상 입니다.' }),
    __metadata("design:type", String)
], NoticesCreateRequestDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '필수 공지 여부(필수 확인 유도)',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NoticesCreateRequestDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '노출 우선순위',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NoticesCreateRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '제목',
        example: '점검 안내',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '제목은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], NoticesCreateRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '본문',
        example: '<p>서비스 점검이 예정되어 있습니다.</p>',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '본문은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], NoticesCreateRequestDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '첨부파일 fileId 목록',
        example: [1],
        type: [Number],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], NoticesCreateRequestDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '예약 발행 시각',
        example: '2025-12-31 09:00:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NoticesCreateRequestDto.prototype, "publishedAt", void 0);
//# sourceMappingURL=notices-create.dto.js.map