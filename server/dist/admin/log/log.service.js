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
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../../config/log.tools.config");
const log_repository_1 = require("./log.repository");
let LogService = class LogService {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async getLoginLogs(dto) {
        try {
            const resuslt = await this.logRepository.findLoginConnect(dto.page, dto.size, dto.type, dto.q);
            return (0, log_tools_config_1.handleSend)(resuslt);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[LogService] getLoginLogs', '관리자 - 접속로그 조회 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('접속로그 조회 오류가 발생했습니다.');
        }
    }
};
exports.LogService = LogService;
exports.LogService = LogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_repository_1.LogRepository])
], LogService);
//# sourceMappingURL=log.service.js.map