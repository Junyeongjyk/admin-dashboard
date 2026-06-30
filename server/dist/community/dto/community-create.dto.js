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
exports.CommunityUserCreateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const community_eum_1 = require("../../common/enum/community.eum");
const class_validator_1 = require("class-validator");
class CommunityUserCreateRequestDto {
    category;
    title;
    content;
    // @ApiPropertyOptional({
    //     description: '첨부파일 ID 목록 (파일업로드 API로 업로드 후 file_id 전달)',
    //     example: [1, 2],
    //     type: [Number],
    // })
    // @IsOptional()
    // @IsArray()
    // @IsNumber({}, { each: true })
    // attachments?: number[];
    isAnonymous;
}
exports.CommunityUserCreateRequestDto = CommunityUserCreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '게시물 내용 유형(카테고리)',
        enum: community_eum_1.CommunityPostType,
        example: community_eum_1.CommunityPostType.QUESTION,
        required: true,
    }),
    (0, class_validator_1.IsEnum)(community_eum_1.CommunityPostType, { message: '유효하지 않은 카테고리입니다.' }),
    __metadata("design:type", String)
], CommunityUserCreateRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '제목',
        example: '이 기능 써보신 분 계신가요?',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'title은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], CommunityUserCreateRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '내용',
        example: '경험 공유 부탁드립니다.',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '내용은 필수 입력값입니다.' }),
    __metadata("design:type", String)
], CommunityUserCreateRequestDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '익명 여부',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CommunityUserCreateRequestDto.prototype, "isAnonymous", void 0);
//# sourceMappingURL=community-create.dto.js.map