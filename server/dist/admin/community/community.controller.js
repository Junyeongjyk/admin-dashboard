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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const community_service_1 = require("./community.service");
const api_response_decorator_1 = require("../../config/swagger/api-response.decorator");
const community_list_dto_1 = require("./dto/community-list.dto");
const community_list_data_dto_1 = require("./dto/data/community-list-data.dto");
const community_create_dto_1 = require("./dto/community-create.dto");
const community_create_data_dto_1 = require("./dto/data/community-create-data.dto");
const community_update_dto_1 = require("./dto/community-update.dto");
const community_delete_dto_1 = require("./dto/community-delete.dto");
const community_comment_create_dto_1 = require("./dto/community-comment-create.dto");
const community_detail_data_dto_1 = require("./dto/data/community-detail-data.dto");
const community_comment_delete_dto_1 = require("./dto/community-comment-delete.dto");
const token_auth_gaurds_1 = require("../../common/gaurds/token-auth.gaurds");
let CommunityController = class CommunityController {
    communityService;
    constructor(communityService) {
        this.communityService = communityService;
    }
    async getList(dto) {
        // console.log(dto)
        return await this.communityService.getList(dto);
    }
    async communityIdDetail(communityId) {
        return await this.communityService.getDetail(communityId);
    }
    async createPost(dto) {
        return await this.communityService.createPost(dto);
    }
    async updatePost(dto) {
        return await this.communityService.updatePost(dto);
    }
    async deletePost(dto) {
        return await this.communityService.deletePost(dto);
    }
    async createPostComment(dto) {
        return await this.communityService.createPostComment(dto);
    }
    async deletePostComment(dto) {
        return await this.communityService.deltePostComment(dto);
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
        okDataDto: community_list_data_dto_1.CommunityListResponseDto,
        requestBodyDtos: [community_list_dto_1.CommunityListRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof community_list_dto_1.CommunityListRequestDto !== "undefined" && community_list_dto_1.CommunityListRequestDto) === "function" ? _a : Object]),
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
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAdminAuthGuard),
    __param(0, (0, common_1.Param)('communityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
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
        okDataDto: community_create_data_dto_1.CommunityCreateResponseDto,
        requestBodyDtos: [community_create_dto_1.CommunityCreateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof community_create_dto_1.CommunityCreateRequestDto !== "undefined" && community_create_dto_1.CommunityCreateRequestDto) === "function" ? _b : Object]),
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
        requestBodyDtos: [community_update_dto_1.CommunityUpdateRequestDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof community_update_dto_1.CommunityUpdateRequestDto !== "undefined" && community_update_dto_1.CommunityUpdateRequestDto) === "function" ? _c : Object]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof community_delete_dto_1.CommunityDeleteRequestDto !== "undefined" && community_delete_dto_1.CommunityDeleteRequestDto) === "function" ? _d : Object]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof community_comment_create_dto_1.CommunityCommentCreateRequestDto !== "undefined" && community_comment_create_dto_1.CommunityCommentCreateRequestDto) === "function" ? _e : Object]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof community_comment_delete_dto_1.CommunityCommentDeleteRequestDto !== "undefined" && community_comment_delete_dto_1.CommunityCommentDeleteRequestDto) === "function" ? _f : Object]),
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
    (0, swagger_1.ApiTags)('관리자 - 커뮤니티관리'),
    (0, common_1.Controller)('/admin/community'),
    (0, common_1.UseGuards)(token_auth_gaurds_1.TokenAdminAuthGuard),
    __metadata("design:paramtypes", [community_service_1.CommunityService])
], CommunityController);
//# sourceMappingURL=community.controller.js.map