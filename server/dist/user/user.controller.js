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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const api_response_decorator_1 = require("../config/swagger/api-response.decorator");
const users_delete_me_dto_1 = require("./dto/users-delete-me.dto");
const token_auth_gaurds_1 = require("../common/gaurds/token-auth.gaurds");
const token_decorator_1 = require("../common/token.decorator");
const users_enum_1 = require("../common/enum/users.enum");
const users_info_data_dto_1 = require("./dto/data/users-info-data.dto");
const users_update_dto_1 = require("./dto/users-update.dto");
const auth_update_pipe_1 = require("./pipes/auth.update.pipe");
const users_update_password_dto_1 = require("./dto/users-update-password.dto");
const auth_update_password_pipe_1 = require("./pipes/auth.update-password.pipe");
let UserController = class UserController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async userInfo(token) {
        return await this.usersService.getUserInfo(token);
    }
    async updateMyProfile(dto, token) {
        return await this.usersService.updateUser(dto, token);
    }
    async updateMyPassword(dto, token) {
        return await this.usersService.updatePassword(dto, token);
    }
    async deleteMe(dto, token, res) {
        return await this.usersService.deleteMe(dto, token, res);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '로그인 유저 정보조회',
        description: '프로필 정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: users_info_data_dto_1.UserInfoResponseDto,
        //okDataDto: FilesDownloadResponseDto,
    }),
    __param(0, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userInfo", null);
__decorate([
    (0, common_1.Patch)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '프로필 정보 수정',
        description: '프로필 정보 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        //okDataDto: FilesDownloadResponseDto,
        requestBodyDtos: [users_update_dto_1.UserUpdateRequestDto],
    }),
    __param(0, (0, common_1.Body)(auth_update_pipe_1.DecryptAndValidateUpdatePipe)),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_update_dto_1.UserUpdateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Patch)('/me/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '패스워드 변경',
        description: '패스워드와 초기 아이디 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        //okDataDto: FilesDownloadResponseDto,
        requestBodyDtos: [users_update_password_dto_1.UserUpdatePasswordRequestDto],
    }),
    __param(0, (0, common_1.Body)(auth_update_password_pipe_1.DecryptAndValidateUpdatePasswordPipe)),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_update_password_dto_1.UserUpdatePasswordRequestDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyPassword", null);
__decorate([
    (0, common_1.Delete)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '계정해지',
        description: '회원 탈퇴(소프트 삭제/비활성)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [users_delete_me_dto_1.UserDeleteMeDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_delete_me_dto_1.UserDeleteMeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteMe", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('유저'),
    (0, common_1.Controller)('/users'),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map