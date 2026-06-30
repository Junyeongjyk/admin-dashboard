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
exports.NoticesService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../config/log.tools.config");
const notices_repository_1 = require("./notices.repository");
let NoticesService = class NoticesService {
    noticesRepository;
    constructor(noticesRepository) {
        this.noticesRepository = noticesRepository;
    }
    async getList(dto, token) {
        try {
            const items = await this.noticesRepository.findNoticesList(token.type);
            return (0, log_tools_config_1.handleSend)({ items });
        }
        catch (error) {
            (0, log_tools_config_1.log)('[NoticesService] getList', '공지사항 목록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('공지사항 목록 오류가 발생했습니다.');
        }
    }
    async getDetail(noticeId, token) {
        try {
            const info = await this.noticesRepository.findById(noticeId);
            if (!info) {
                throw new common_1.NotFoundException('공지사항 존재하지 않습니다.');
            }
            return (0, log_tools_config_1.handleSend)(info);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[NoticesService] getList', '공지사항 상세 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('공지사항 상세 오류가 발생했습니다.');
        }
    }
};
exports.NoticesService = NoticesService;
exports.NoticesService = NoticesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notices_repository_1.NoticesRepository])
], NoticesService);
//# sourceMappingURL=notices.service.js.map