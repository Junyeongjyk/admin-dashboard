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
exports.FaqsCreateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const faq_enum_1 = require("../../../common/enum/faq.enum");
const class_validator_1 = require("class-validator");
class FaqsCreateRequestDto {
    category;
    question;
    answer;
    isPublished;
    orderNo;
}
exports.FaqsCreateRequestDto = FaqsCreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '카테고리',
        enum: faq_enum_1.FaqCategory,
        example: faq_enum_1.FaqCategory.PAYMENT,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(faq_enum_1.FaqCategory, { message: '유효하지 않은 카테고리 입니다.' }),
    __metadata("design:type", String)
], FaqsCreateRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '질문',
        example: '환불은 어떻게 하나요?',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '질문은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], FaqsCreateRequestDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '답변',
        example: '환불은 결제 내역에서 신청할 수 있습니다.',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '답변는 필수 입력값입니다.' }),
    __metadata("design:type", String)
], FaqsCreateRequestDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '공개 여부',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FaqsCreateRequestDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '노출 순서',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FaqsCreateRequestDto.prototype, "orderNo", void 0);
//# sourceMappingURL=faqs-create.dto.js.map