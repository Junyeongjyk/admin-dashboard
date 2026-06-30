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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const faqs_service_1 = require("./faqs.service");
const api_response_decorator_1 = require("../../config/swagger/api-response.decorator");
const faqs_create_dto_1 = require("./dto/faqs-create.dto");
const faqs_create_data_dto_1 = require("./dto/data/faqs-create-data.dto");
const faqs_delete_dto_1 = require("./dto/faqs-delete.dto");
const faqs_search_dto_1 = require("./dto/faqs-search.dto");
const token_decorator_1 = require("../../common/token.decorator");
let FaqsController = class FaqsController {
    faqsService;
    constructor(faqsService) {
        this.faqsService = faqsService;
    }
    async createFaq(dto, token) {
        return await this.faqsService.createFaq(dto, token);
    }
    // @Patch('/')
    // @HttpCode(HttpStatus.OK)
    // @ApiStdResponses({
    //     summary: 'FAQ 수정',
    //     description: 'FAQ 수정(부분 수정 가능)',
    //     okExampleCode: 'SUCCESS',
    //     okExampleMessage: '요청 성공',
    //     okDataDto: FaqsUpdateResponseDto,
    //     requestBodyDtos: [FaqsUpdateRequestDto],
    // })
    // async updateFaq(@Body() dto: FaqsUpdateRequestDto) {
    //     return await this.faqsService.updateFaq(dto)
    // }
    async deleteFaq(dto) {
        console.log(dto);
        return await this.faqsService.deleteFaq(dto);
    }
    async searchFaq(dto) {
        return await this.faqsService.searchFaq(dto);
    }
};
exports.FaqsController = FaqsController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: 'FAQ 등록',
        description: 'FAQ 신규 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: faqs_create_data_dto_1.FaqsCreateResponseDto,
        requestBodyDtos: [faqs_create_dto_1.FaqsCreateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)("ADMIN")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faqs_create_dto_1.FaqsCreateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "createFaq", null);
__decorate([
    (0, common_1.Delete)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: 'FAQ 삭제',
        description: 'FAQ 삭제(soft delete)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: faqs_create_data_dto_1.FaqsCreateResponseDto,
        requestBodyDtos: [faqs_delete_dto_1.FaqsDeleteRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faqs_delete_dto_1.FaqsDeleteRequestDto]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "deleteFaq", null);
__decorate([
    (0, common_1.Post)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: 'FAQ 목록 조회(관리자)',
        description: '관리자용 FAQ 목록 조회(비공개 포함)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: faqs_create_data_dto_1.FaqsCreateResponseDto,
        requestBodyDtos: [faqs_search_dto_1.FaqsSearchRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faqs_search_dto_1.FaqsSearchRequestDto]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "searchFaq", null);
exports.FaqsController = FaqsController = __decorate([
    (0, swagger_1.ApiTags)('관리자 - FAQ관리'),
    (0, common_1.Controller)('/admin/faqs'),
    __metadata("design:paramtypes", [typeof (_a = typeof faqs_service_1.FaqsService !== "undefined" && faqs_service_1.FaqsService) === "function" ? _a : Object])
], FaqsController);
//# sourceMappingURL=faq.controller.js.map