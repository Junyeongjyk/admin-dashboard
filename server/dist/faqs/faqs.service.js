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
exports.FaqsService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../config/log.tools.config");
const faqs_repository_1 = require("./faqs.repository");
let FaqsService = class FaqsService {
    faqsRepository;
    constructor(faqsRepository) {
        this.faqsRepository = faqsRepository;
    }
    async getList(dto) {
        try {
            const items = await this.faqsRepository.findFaqsList();
            return (0, log_tools_config_1.handleSend)({ items });
        }
        catch (error) {
            (0, log_tools_config_1.log)('[FaqsService] getList', 'FAQ 목록 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('FAQ 목록 오류가 발생했습니다.');
        }
    }
};
exports.FaqsService = FaqsService;
exports.FaqsService = FaqsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [faqs_repository_1.FaqsRepository])
], FaqsService);
//# sourceMappingURL=faqs.service.js.map