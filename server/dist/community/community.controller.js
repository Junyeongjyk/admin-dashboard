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
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const community_service_1 = require("./community.service");
const api_response_decorator_1 = require("../config/swagger/api-response.decorator");
const community_list_dto_1 = require("./dto/community-list.dto");
const community_list_data_dto_1 = require("./dto/data/community-list-data.dto");
const community_create_dto_1 = require("./dto/community-create.dto");
const community_update_dto_1 = require("./dto/community-update.dto");
const community_delete_dto_1 = require("./dto/community-delete.dto");
const community_comment_create_dto_1 = require("./dto/community-comment-create.dto");
const community_detail_data_dto_1 = require("./dto/data/community-detail-data.dto");
const community_comment_delete_dto_1 = require("./dto/community-comment-delete.dto");
const token_decorator_1 = require("../common/token.decorator");
const users_enum_1 = require("../common/enum/users.enum");
const token_auth_gaurds_1 = require("../common/gaurds/token-auth.gaurds");
let CommunityController = class CommunityController {
    communityService;
    constructor(communityService) {
        this.communityService = communityService;
    }
    async getList(dto, token) {
        return await this.communityService.getList(dto, token);
    }
    async communityIdDetail(communityId, token) {
        return await this.communityService.getDetail(communityId, token);
    }
    async createPost(dto, token) {
        return await this.communityService.createPost(dto, token);
    }
    async updatePost(dto, token) {
        return await this.communityService.updatePost(dto, token);
    }
    async deletePost(dto, token) {
        return await this.communityService.deletePost(dto, token);
    }
    async createPostComment(dto, token) {
        return await this.communityService.createPostComment(dto, token);
    }
    async deletePostComment(dto, token) {
        return await this.communityService.deltePostComment(dto, token);
    }
    async mainImageView(id, res) {
        return await this.communityService.getMainImage(id, res);
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, common_1.Post)('/posts/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '게시물 리스트',
        description: ' 커뮤니티 게시물 목록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: community_list_data_dto_1.CommunityUserListResponseDto,
        requestBodyDtos: [community_list_dto_1.CommunityUserListRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_list_dto_1.CommunityUserListRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('/posts/:communityId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '커뮤니티 내용확인',
        description: '커뮤니티 상세정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: community_detail_data_dto_1.CommunityUserDetailResponseDto,
        pathParams: [
            { name: 'communityId', description: '커뮤니티 ID', example: 1 }
        ]
    }),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __param(0, (0, common_1.Param)('communityId')),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "communityIdDetail", null);
__decorate([
    (0, common_1.Post)('/posts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '게시물 등록',
        description: ' 커뮤니티 게시물 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        // okDataDto: CommunityCreateResponseDto,
        requestBodyDtos: [community_create_dto_1.CommunityUserCreateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_create_dto_1.CommunityUserCreateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createPost", null);
__decorate([
    (0, common_1.Patch)('/posts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '게시물 수정',
        description: ' 커뮤니티 게시물 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [community_update_dto_1.CommunityUserUpdateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_update_dto_1.CommunityUserUpdateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)('/posts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '게시물 삭제',
        description: ' 게시물 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [community_delete_dto_1.CommunityDeleteRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_delete_dto_1.CommunityDeleteRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Post)('/posts/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '댓글 등록',
        description: ' 댓글 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: community_detail_data_dto_1.CommunityUserDetailResponseDto,
        requestBodyDtos: [community_comment_create_dto_1.CommunityCommentCreateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_comment_create_dto_1.CommunityCommentCreateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createPostComment", null);
__decorate([
    (0, common_1.Delete)('/posts/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_response_decorator_1.ApiStdResponses)({
        summary: '댓글 삭제',
        description: ' 댓글 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: community_detail_data_dto_1.CommunityUserDetailResponseDto,
        requestBodyDtos: [community_comment_delete_dto_1.CommunityCommentDeleteRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, token_decorator_1.Token)([users_enum_1.UserType.USER, users_enum_1.UserType.PARTNER])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_comment_delete_dto_1.CommunityCommentDeleteRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "deletePostComment", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Get)('/posts/main/view/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "mainImageView", null);
exports.CommunityController = CommunityController = __decorate([
    (0, swagger_1.ApiTags)('커뮤니티'),
    (0, common_1.Controller)('community'),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof community_service_1.CommunityService !== "undefined" && community_service_1.CommunityService) === "function" ? _a : Object])
], CommunityController);
//# sourceMappingURL=community.controller.js.map