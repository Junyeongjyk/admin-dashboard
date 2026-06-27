
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { CommunityService } from "./community.service";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { CommunityListRequestDto } from "./dto/community-list.dto";
import { CommunityListResponseDto } from "./dto/data/community-list-data.dto";
import { CommunityCreateRequestDto } from "./dto/community-create.dto";
import { CommunityCreateResponseDto } from "./dto/data/community-create-data.dto";
import { CommunityUpdateRequestDto } from "./dto/community-update.dto";
import { CommunityDeleteRequestDto } from "./dto/community-delete.dto";
import { CommunityCommentCreateRequestDto } from "./dto/community-comment-create.dto";
import { CommunityUserDetailResponseDto, CommunityCommentItem } from "./dto/data/community-detail-data.dto";
import { CommunityCommentDeleteRequestDto } from "./dto/community-comment-delete.dto";
import { Token } from "../../common/token.decorator";
import { TokenAdminAuthGuard } from "../../common/gaurds/token-auth.gaurds";
import { Response } from 'express';

@ApiTags('관리자 - 커뮤니티관리')
@Controller('/admin/community')
@UseGuards(TokenAdminAuthGuard)
export class CommunityController {

    constructor(
        private readonly communityService: CommunityService,
    ) {}

    @Post('/posts/list')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 리스트',
        description: ' 커뮤니티 게시물 목록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityListResponseDto,
        requestBodyDtos: [CommunityListRequestDto],
    })
    async getList(@Body() dto: CommunityListRequestDto) {
        // console.log(dto)
        return await this.communityService.getList(dto)
    }

    @Get('/posts/:communityId')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '커뮤니티 내용확인',
        description: '커뮤니티 상세정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityUserDetailResponseDto,
        pathParams:[
            {name: 'communityId', description: '커뮤니티 ID', example: 1 }
        ]
    })
    @UseGuards(TokenAdminAuthGuard)
    async communityIdDetail(@Param('communityId') communityId: number) {
        return await this.communityService.getDetail(communityId);
    }

    @Post('/posts')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 등록',
        description: ' 커뮤니티 게시물 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityCreateResponseDto,
        requestBodyDtos: [CommunityCreateRequestDto],
    })
    async createPost(@Body() dto: CommunityCreateRequestDto) {
        return await this.communityService.createPost(dto);
    }

    @Patch('/posts')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 수정',
        description: ' 커뮤니티 게시물 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [CommunityUpdateRequestDto],
    })
    async updatePost(@Body() dto: CommunityUpdateRequestDto) {
        return await this.communityService.updatePost(dto)
    }

    @Delete('/posts')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 삭제',
        description: ' 게시물 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [CommunityDeleteRequestDto],
    })
    async deletePost(@Body() dto: CommunityDeleteRequestDto) {
        return await this.communityService.deletePost(dto);
    }

    @Post('/posts/comments')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '댓글 등록',
        description: ' 댓글 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityUserDetailResponseDto,
        requestBodyDtos: [CommunityCommentCreateRequestDto],
    })
    async createPostComment(@Body() dto: CommunityCommentCreateRequestDto) {
        return await this.communityService.createPostComment(dto);
    }

    @Delete('/posts/comments')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '댓글 삭제',
        description: ' 댓글 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityUserDetailResponseDto,
        requestBodyDtos: [CommunityCommentDeleteRequestDto],
    })
    async deletePostComment(@Body() dto: CommunityCommentDeleteRequestDto) {
        return await this.communityService.deltePostComment(dto);
    }


    
    @ApiExcludeEndpoint()
    @Get('/posts/main/view/:id')
    async mainImageView(@Param('id') id: number, @Res() res: Response) {
        return await this.communityService.getMainImage(id, res)
    }

}