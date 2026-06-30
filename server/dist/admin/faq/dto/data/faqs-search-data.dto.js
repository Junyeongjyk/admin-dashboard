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
exports.FaqsSearchResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const faq_enum_1 = require("../../../../common/enum/faq.enum");
class FaqListItem {
    faqId;
    category;
    question;
    isPublished;
    orderNo;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FAQ ID', example: 1 }),
    __metadata("design:type", Number)
], FaqListItem.prototype, "faqId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '카테고리', enum: faq_enum_1.FaqCategory, example: faq_enum_1.FaqCategory.PAYMENT }),
    __metadata("design:type", String)
], FaqListItem.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '질문', example: '환불은 어떻게 하나요?' }),
    __metadata("design:type", String)
], FaqListItem.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '공개 여부', example: true }),
    __metadata("design:type", Boolean)
], FaqListItem.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '노출 순서', example: 1 }),
    __metadata("design:type", Number)
], FaqListItem.prototype, "orderNo", void 0);
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
class FaqsSearchResponseDto {
    items;
    page;
}
exports.FaqsSearchResponseDto = FaqsSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FAQ 목록',
        type: [FaqListItem],
        example: [
            {
                faqId: 1,
                category: 'PAYMENT',
                question: '환불은 어떻게 하나요?',
                isPublished: true,
                orderNo: 1,
            },
        ],
    }),
    __metadata("design:type", Array)
], FaqsSearchResponseDto.prototype, "items", void 0);
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
], FaqsSearchResponseDto.prototype, "page", void 0);
//# sourceMappingURL=faqs-search-data.dto.js.map