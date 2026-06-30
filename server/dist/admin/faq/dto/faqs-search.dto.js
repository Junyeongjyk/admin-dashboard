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
exports.FaqsSearchRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const faq_enum_1 = require("../../../common/enum/faq.enum");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class FaqsSearchRequestDto {
    category;
    q;
    isPublished;
    page;
    size;
}
exports.FaqsSearchRequestDto = FaqsSearchRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '카테고리',
        enum: faq_enum_1.FaqCategory,
        example: faq_enum_1.FaqCategory.PAYMENT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(faq_enum_1.FaqCategory, { message: '유효하지 않은 카테고리 입니다.' }),
    __metadata("design:type", String)
], FaqsSearchRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '키워드',
        example: '환불',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FaqsSearchRequestDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '공개 여부',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FaqsSearchRequestDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '페이지', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FaqsSearchRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '크기', example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FaqsSearchRequestDto.prototype, "size", void 0);
//# sourceMappingURL=faqs-search.dto.js.map