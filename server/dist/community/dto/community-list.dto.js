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
exports.CommunityUserListRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const community_eum_1 = require("../../common/enum/community.eum");
const class_validator_1 = require("class-validator");
class CommunityUserListRequestDto {
    category;
    page;
    q;
    filter;
    size;
}
exports.CommunityUserListRequestDto = CommunityUserListRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '게시물 내용 유형(카테고리)',
        enum: community_eum_1.CommunityCategory,
        example: community_eum_1.CommunityCategory.CLIENT,
        required: true
    }),
    (0, class_validator_1.IsEnum)(community_eum_1.CommunityCategory, {
        message: '유효하지 않은 게시물 카테고리입니다.',
    }),
    __metadata("design:type", String)
], CommunityUserListRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '페이지', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CommunityUserListRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '검색어', example: '의뢰' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommunityUserListRequestDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '검색어 타입',
        enum: community_eum_1.SearchType,
        example: community_eum_1.SearchType.TITLE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(community_eum_1.SearchType),
    __metadata("design:type", String)
], CommunityUserListRequestDto.prototype, "filter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '페이지 크기', example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CommunityUserListRequestDto.prototype, "size", void 0);
//# sourceMappingURL=community-list.dto.js.map