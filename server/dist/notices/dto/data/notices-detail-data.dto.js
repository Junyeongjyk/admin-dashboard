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
exports.NoticesUserDetailResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const notices_list_data_dto_1 = require("./notices-list-data.dto");
class NoticesUserDetailResponseDto extends notices_list_data_dto_1.NoticesItem {
    content;
}
exports.NoticesUserDetailResponseDto = NoticesUserDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공지사항 내용',
        example: '이용수칙.......',
        required: true
    }),
    __metadata("design:type", String)
], NoticesUserDetailResponseDto.prototype, "content", void 0);
//# sourceMappingURL=notices-detail-data.dto.js.map