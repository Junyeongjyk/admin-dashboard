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
const notices_service_1 = require("./notices.service");
const notices_list_data_dto_1 = require("./dto/data/notices-list-data.dto");
const api_response_decorator_1 = require("../../config/swagger/api-response.decorator");
const notices_list_dto_1 = require("./dto/notices-list.dto");
const notices_delete_dto_1 = require("./dto/notices-delete.dto");
const notices_create_dto_1 = require("./dto/notices-create.dto");
const token_decorator_1 = require("../../common/token.decorator");
let NoticesController = class NoticesController {
    noticesService;
    constructor(noticesService) {
        this.noticesService = noticesService;
    }
    async noticesList(dto) {
        // console.log(dto )
        return await this.noticesService.getList(dto);
    }
    // @Get('/:noticeId')
    // @HttpCode(HttpStatus.OK)
    // @ApiStdResponses({
    //     summary: '공지사항 내용확인',
    //     description: '공지사항 상세정보 조회',
    //     okExampleCode: 'SUCCESS',
    //     okExampleMessage: '요청 성공',
    //     okDataDto: NoticesDetailResponseDto,
    //     pathParams:[
    //         {name: 'noticeId', description: '공지사항 PK', example: 1 }
    //     ]
    // })
    // async noticesDetail(@Param('noticeId') noticeId: number) {
    //     return await this.noticesService.getDetail(noticeId);
    // }
    async noticesDelete(dto) {
        return await this.noticesService.noticesDelete(dto);
    }
    async noticesCreate(dto, token) {
        // async noticesCreate(@Body() dto: NoticesCreateRequestDto) {
        //     let token = null;
        // console.log(token)
        return await this.noticesService.noticesCreate(dto, token);
    }
};
exports.NoticesController = NoticesController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '공지사항 목록 조회',
        description: '관리자 공지사항 목록조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: notices_list_data_dto_1.NoticesListResponseDto,
        requestBodyDtos: [notices_list_dto_1.NoticesListRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notices_list_dto_1.NoticesListRequestDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "noticesList", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '공지사항 삭제',
        description: '관리자 공지사항 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [notices_delete_dto_1.NoticesDeleteRequestDto]
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notices_delete_dto_1.NoticesDeleteRequestDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "noticesDelete", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '공지사항 등록',
        description: '공지사항 등록(대상: 파트너/의뢰인/전체, 필수 공지 여부 포함)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [notices_create_dto_1.NoticesCreateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)("ADMIN")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notices_create_dto_1.NoticesCreateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "noticesCreate", null);
exports.NoticesController = NoticesController = __decorate([
    (0, swagger_1.ApiTags)('관리자 - 공지사항 관리'),
    (0, common_1.Controller)('/admin/notices'),
    __metadata("design:paramtypes", [notices_service_1.NoticesService])
], NoticesController);
//# sourceMappingURL=notices.controller.js.map