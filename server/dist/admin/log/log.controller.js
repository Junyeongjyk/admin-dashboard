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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_decorator_1 = require("../../config/swagger/api-response.decorator");
const log_service_1 = require("./log.service");
const log_user_dto_1 = require("./dto/log-user.dto");
const log_user_data_dto_1 = require("./dto/data/log-user-data.dto");
let LogController = class LogController {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    async getLoninLogs(dto) {
        return await this.logService.getLoginLogs(dto);
    }
};
exports.LogController = LogController;
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '유저 접속로그 확인',
        description: '로그 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: log_user_data_dto_1.LogUserResponseDto,
        requestBodyDtos: [log_user_dto_1.LogUserRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_user_dto_1.LogUserRequestDto]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "getLoninLogs", null);
exports.LogController = LogController = __decorate([
    (0, swagger_1.ApiTags)('관리자 - 로그관리'),
    (0, common_1.Controller)('/admin/log'),
    __metadata("design:paramtypes", [log_service_1.LogService])
], LogController);
//# sourceMappingURL=log.controller.js.map