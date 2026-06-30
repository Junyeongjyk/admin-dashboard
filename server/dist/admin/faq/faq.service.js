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
exports.FaqsService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../../config/log.tools.config");
const faqs_repository_1 = require("./faqs.repository");
let FaqsService = class FaqsService {
    faqsRepository;
    constructor(faqsRepository) {
        this.faqsRepository = faqsRepository;
    }
    async createFaq(dto, token) {
        try {
            const result = await this.faqsRepository.createFaq(dto, token);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[FaqsService] createFaq', '관리자 - Faq 등록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Faq 등록 오류가 발생했습니다.');
        }
    }
    // async updateFaq(dto: FaqsUpdateRequestDto) {
    //     try {
    //         // TODO:
    //         // - Admin 권한 체크
    //         // - faqId 존재 확인
    //         // - dto에서 전달된 필드만 부분 업데이트
    //         // - order_no 중복/재정렬 정책 필요하면 처리
    //         return handleSend({
    //             faqId: 1,
    //             updatedAt: '2025-12-31 12:00:00',
    //         })
    //     } catch (error) {
    //         log('[FaqsService] createFaq',  '관리자 - Faq 수정 오류가 발생했습니다.', error)
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException('Faq 수정 오류가 발생했습니다.')
    //     }
    // }
    async deleteFaq(dto) {
        try {
            const result = await this.faqsRepository.deleteFaq(dto);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[FaqsService] createFaq', '관리자 - Faq 삭제 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Faq 삭제 오류가 발생했습니다.');
        }
    }
    async searchFaq(dto) {
        try {
            const result = await this.faqsRepository.searchFaq(dto);
            return (0, log_tools_config_1.handleSend)(result);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[FaqsService] createFaq', '관리자 - Faq 리스트 조회 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Faq 리스트 조회 오류가 발생했습니다.');
        }
    }
};
exports.FaqsService = FaqsService;
exports.FaqsService = FaqsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof faqs_repository_1.FaqsRepository !== "undefined" && faqs_repository_1.FaqsRepository) === "function" ? _a : Object])
], FaqsService);
//# sourceMappingURL=faq.service.js.map