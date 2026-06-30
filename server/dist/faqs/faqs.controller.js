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
exports.FaqsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_decorator_1 = require("../config/swagger/api-response.decorator");
const faqs_list_dto_1 = require("./dto/faqs-list.dto");
const faqs_service_1 = require("./faqs.service");
const faqs_list_data_dto_1 = require("./dto/data/faqs-list-data.dto");
const token_auth_gaurds_1 = require("../common/gaurds/token-auth.gaurds");
const token_decorator_1 = require("../common/token.decorator");
const users_enum_1 = require("../common/enum/users.enum");
let FaqsController = class FaqsController {
    faqsService;
    constructor(faqsService) {
        this.faqsService = faqsService;
    }
    async faqsList(dto, token) {
        return await this.faqsService.getList(dto);
    }
};
exports.FaqsController = FaqsController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: 'FAQ 조회',
        description: ' 목록 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: faqs_list_data_dto_1.FaqsListResponseDto,
        requestBodyDtos: [faqs_list_dto_1.FaqsListRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.CLIENT, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faqs_list_dto_1.FaqsListRequestDto, Object]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "faqsList", null);
exports.FaqsController = FaqsController = __decorate([
    (0, swagger_1.ApiTags)('FAQ'),
    (0, common_1.Controller)('faqs'),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __metadata("design:paramtypes", [faqs_service_1.FaqsService])
], FaqsController);
//# sourceMappingURL=faqs.controller.js.map