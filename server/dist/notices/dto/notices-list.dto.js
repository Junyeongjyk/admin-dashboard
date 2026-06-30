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
exports.NoticesListRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const notices_enum_1 = require("../../common/enum/notices.enum");
class NoticesListRequestDto {
    category;
    page;
    size;
}
exports.NoticesListRequestDto = NoticesListRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 유형',
        enum: notices_enum_1.NoticesCategory,
        example: notices_enum_1.NoticesCategory.NORMAL,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoticesListRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '현재 페이지',
        example: '1',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoticesListRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '리스트 수',
        example: '20',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoticesListRequestDto.prototype, "size", void 0);
//# sourceMappingURL=notices-list.dto.js.map