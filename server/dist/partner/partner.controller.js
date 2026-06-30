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
exports.PartnerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_decorator_1 = require("../config/swagger/api-response.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const partner_service_1 = require("./partner.service");
const token_decorator_1 = require("../common/token.decorator");
const users_enum_1 = require("../common/enum/users.enum");
const partner_update_profile_dto_1 = require("./dto/partner-update-profile.dto");
let PartnerController = class PartnerController {
    partnerService;
    constructor(partnerService) {
        this.partnerService = partnerService;
    }
    async getMyPartnerInfo(token) {
        return await this.partnerService.getMePartnerProfile(token);
    }
    async updateMyPartnerInfo(dto, token, files) {
        const profileImage = files?.profileImage?.[0];
        const businessRegistrationImage = files?.businessRegistrationImage?.[0];
        return await this.partnerService.updatePartnerProfile(dto, token, profileImage, businessRegistrationImage);
    }
};
exports.PartnerController = PartnerController;
__decorate([
    (0, common_1.Post)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '내 파트너정보 확인',
        description: '로그인한 파트너 프로필 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: PartnerProfileResponseDto,
    }),
    __param(0, (0, token_decorator_1.Token)(users_enum_1.UserType.PARTNER)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "getMyPartnerInfo", null);
__decorate([
    (0, common_1.Patch)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '파트너 프로필 수정',
        description: '내 파트너 프로필 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [partner_update_profile_dto_1.PartnerUpdateProfileRequestDto]
    }),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'profileImage', maxCount: 1 },
        { name: 'businessRegistrationImage', maxCount: 1 },
    ], {
        limits: {
            fileSize: 10 * 1024 * 1024, // 전체 최대치
        },
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'profileImage') {
                if (!file.mimetype.match(/(jpg|jpeg|png)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('프로필 사진 jpg, png 파일만 업로드 가능합니다.'), false);
                }
            }
        }
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)(users_enum_1.UserType.PARTNER)),
    __param(2, (0, common_2.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof partner_update_profile_dto_1.PartnerUpdateProfileRequestDto !== "undefined" && partner_update_profile_dto_1.PartnerUpdateProfileRequestDto) === "function" ? _a : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PartnerController.prototype, "updateMyPartnerInfo", null);
exports.PartnerController = PartnerController = __decorate([
    (0, swagger_1.ApiTags)('파트너'),
    (0, common_1.Controller)('partner'),
    __metadata("design:paramtypes", [partner_service_1.PartnerService])
], PartnerController);
//# sourceMappingURL=partner.controller.js.map