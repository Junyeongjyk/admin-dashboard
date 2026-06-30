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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticesService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../../config/log.tools.config");
const notices_repository_1 = require("./notices.repository");
let NoticesService = class NoticesService {
    noticesRepository;
    constructor(noticesRepository) {
        this.noticesRepository = noticesRepository;
    }
    async getList(dto) {
        try {
            const result = await this.noticesRepository.getList(dto);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[NoticesService] getList', '관리자 - 공지사항 목록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('관리자 - 공지사항 목록 오류가 발생했습니다.');
        }
    }
    // async getDetail(noticeId: number) {
    //     try {
    //         /**
    //          * TODO 공지사항 상세조회
    //          * 1. 유효한 공지인지 데이터 검사
    //          */
    //         const sample = {
    //             id: 1, 
    //             title: '이용 수칙',
    //             content: '1. 이용수칙.........',
    //             attachments: [
    //                 {url: 'https://도메인/api/filedownload', fileName: 'event.png'}
    //             ]
    //         }
    //         return handleSend(sample)
    //     } catch (error) {
    //         log('[NoticesService] getList',  '공지사항 상세 오류가 발생했습니다.', error)
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException('공지사항상세 오류가 발생했습니다.')
    //     }
    // }
    async noticesDelete(dto) {
        try {
            const result = await this.noticesRepository.noticesDelete(dto);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[NoticesService] noticesDelete', '공지사항 삭제 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('공지사항 삭제 오류가 발생했습니다.');
        }
    }
    async noticesCreate(dto, token) {
        try {
            const result = await this.noticesRepository.noticesCreate(dto, token);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[NoticesService] noticesCreate', '관리자 - 공지사항 등록중 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('공지사항 등록 오류가 발생했습니다.');
        }
    }
};
exports.NoticesService = NoticesService;
exports.NoticesService = NoticesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notices_repository_1.NoticesRepository !== "undefined" && notices_repository_1.NoticesRepository) === "function" ? _a : Object])
], NoticesService);
//# sourceMappingURL=community.service.js.map