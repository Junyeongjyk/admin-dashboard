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
exports.ApiResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponseDto {
    status;
    code;
    message;
    data;
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: '성공(1) / 실패(0)' }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SUCCESS', description: '서비스 응답 코드' }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '요청 성공', description: '메시지' }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '응답 데이터' }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=ApiResponseDto.js.map