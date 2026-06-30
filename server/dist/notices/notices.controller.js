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
exports.NoticesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_decorator_1 = require("../config/swagger/api-response.decorator");
const notices_service_1 = require("./notices.service");
const notices_list_data_dto_1 = require("./dto/data/notices-list-data.dto");
const notices_detail_data_dto_1 = require("./dto/data/notices-detail-data.dto");
const notices_list_dto_1 = require("./dto/notices-list.dto");
const token_auth_gaurds_1 = require("../common/gaurds/token-auth.gaurds");
const token_decorator_1 = require("../common/token.decorator");
const users_enum_1 = require("../common/enum/users.enum");
let NoticesController = class NoticesController {
    noticesService;
    constructor(noticesService) {
        this.noticesService = noticesService;
    }
    async noticesList(dto, token) {
        return await this.noticesService.getList(dto, token);
    }
    async noticesDetail(noticeId, token) {
        return await this.noticesService.getDetail(noticeId, token);
    }
};
exports.NoticesController = NoticesController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '공지사항 목록 조회',
        description: '회원 유형별 공지사항 목록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: notices_list_data_dto_1.NoticesUserListResponseDto,
        requestBodyDtos: [notices_list_dto_1.NoticesListRequestDto],
    }),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notices_list_dto_1.NoticesListRequestDto, Object]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "noticesList", null);
__decorate([
    (0, common_1.Get)('/:noticeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '공지사항 내용확인',
        description: '공지사항 상세정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: notices_detail_data_dto_1.NoticesUserDetailResponseDto,
        pathParams: [
            { name: 'noticeId', description: '공지사항 PK', example: 1 }
        ]
    }),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __param(0, (0, common_1.Param)('noticeId')),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "noticesDetail", null);
exports.NoticesController = NoticesController = __decorate([
    (0, swagger_1.ApiTags)('공지사항'),
    (0, common_1.Controller)('notices'),
    __metadata("design:paramtypes", [notices_service_1.NoticesService])
], NoticesController);
//# sourceMappingURL=notices.controller.js.map