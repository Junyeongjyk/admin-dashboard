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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_decorator_1 = require("../../config/swagger/api-response.decorator");
const partner_service_1 = require("./partner.service");
const partner_approval_dto_1 = require("./dto/partner-approval.dto");
const user_list_dto_1 = require("../user/dto/user-list.dto");
const user_list_data_dto_1 = require("../user/dto/data/user-list-data.dto");
let PartnerController = class PartnerController {
    partnerService;
    constructor(partnerService) {
        this.partnerService = partnerService;
    }
    async getList(dto) {
        return await this.partnerService.getList(dto);
    }
    async approvePartner(dto) {
        return await this.partnerService.approvePartner(dto);
    }
};
exports.PartnerController = PartnerController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '파트너 리스트',
        description: '파트너 리스트 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: user_list_data_dto_1.UserListResponseDto,
        requestBodyDtos: [user_list_dto_1.UserListRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_list_dto_1.UserListRequestDto !== "undefined" && user_list_dto_1.UserListRequestDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)('/approval'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '파트너 회원가입 승인/거부',
        description: '파트너 회원가입 신청 건을 승인 또는 거부 처리',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [partner_approval_dto_1.PartnerApprovalRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof partner_approval_dto_1.PartnerApprovalRequestDto !== "undefined" && partner_approval_dto_1.PartnerApprovalRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "approvePartner", null);
exports.PartnerController = PartnerController = __decorate([
    (0, swagger_1.ApiTags)('관리자 - 파트너 관리'),
    (0, common_1.Controller)('/admin/partner'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService])
], PartnerController);
//# sourceMappingURL=partner.controller.js.map