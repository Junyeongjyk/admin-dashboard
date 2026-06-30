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
exports.FaqsListResponseDto = exports.FaqsItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class FaqsItem {
    id;
    question;
    answer;
}
exports.FaqsItem = FaqsItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FAQ PK 번호',
        example: 1,
        required: true,
    }),
    __metadata("design:type", Number)
], FaqsItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '질문',
        example: 'App  로그인시 로그인이 안되요',
        required: true,
    }),
    __metadata("design:type", String)
], FaqsItem.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '답변',
        example: '네트워크 연결 확인',
        required: true
    }),
    __metadata("design:type", String)
], FaqsItem.prototype, "answer", void 0);
class FaqsListResponseDto {
    items;
}
exports.FaqsListResponseDto = FaqsListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FAQ 리스트',
        required: true,
        type: () => [FaqsItem]
    }),
    __metadata("design:type", Array)
], FaqsListResponseDto.prototype, "items", void 0);
//# sourceMappingURL=faqs-profile-data.dto.js.map