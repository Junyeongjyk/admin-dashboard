
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { CommunityService } from "./community.service";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { CommunityClientListRequestDto } from "./dto/community-list.dto";
import { CommunityClientListResponseDto } from "./dto/data/community-list-data.dto";
import { CommunityClientCreateRequestDto } from "./dto/community-create.dto";
import { CommunityClientUpdateRequestDto } from "./dto/community-update.dto";
import { CommunityDeleteRequestDto } from "./dto/community-delete.dto";
import { CommunityCommentCreateRequestDto } from "./dto/community-comment-create.dto";
import { CommunityClientDetailResponseDto, CommunityCommentItem } from "./dto/data/community-detail-data.dto";
import { CommunityCommentDeleteRequestDto } from "./dto/community-comment-delete.dto";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/users.enum";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";
import { Response } from 'express';

@ApiTags('커뮤니티')
@Controller('community')
@UseGuards(TokenAuthGuard)
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
        okDataDto: CommunityClientListResponseDto,
        requestBodyDtos: [CommunityClientListRequestDto],
    })
    async getList(
        @Body() dto: CommunityClientListRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.communityService.getList(dto, token)
    }

    @Get('/posts/:communityId')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '커뮤니티 내용확인',
        description: '커뮤니티 상세정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityClientDetailResponseDto,
        pathParams:[
            {name: 'communityId', description: '커뮤니티 ID', example: 1 }
        ]
    })
    @UseGuards(TokenAuthGuard)
    async communityIdDetail(@Param('communityId') communityId: number, @Token([UserType.USER, UserType.PARTNER]) token:any) {
        return await this.communityService.getDetail(communityId, token);
    }

    @Post('/posts')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 등록',
        description: ' 커뮤니티 게시물 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        // okDataDto: CommunityCreateResponseDto,
        requestBodyDtos: [CommunityClientCreateRequestDto],
    })
    async createPost(
        @Body() dto: CommunityClientCreateRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any)
    {
        return await this.communityService.createPost(dto, token)
    }

    @Patch('/posts')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '게시물 수정',
        description: ' 커뮤니티 게시물 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [CommunityClientUpdateRequestDto],
    })
    async updatePost(
        @Body() dto: CommunityClientUpdateRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any    
    ) {
        return await this.communityService.updatePost(dto, token)
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
    async deletePost(
        @Body() dto: CommunityDeleteRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any    
    ) {
        return await this.communityService.deletePost(dto, token)
    }

    @Post('/posts/comments')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '댓글 등록',
        description: ' 댓글 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityClientDetailResponseDto,
        requestBodyDtos: [CommunityCommentCreateRequestDto],
    })
    async createPostComment(
        @Body() dto: CommunityCommentCreateRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.communityService.createPostComment(dto, token)
    }

    @Delete('/posts/comments')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '댓글 삭제',
        description: ' 댓글 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: CommunityClientDetailResponseDto,
        requestBodyDtos: [CommunityCommentDeleteRequestDto],
    })
    async deletePostComment(
        @Body() dto: CommunityCommentDeleteRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.communityService.deltePostComment(dto, token)
    }


    @ApiExcludeEndpoint()
    @Get('/posts/main/view/:id')
    async mainImageView(@Param('id') id: number, @Res() res: Response) {
        return await this.communityService.getMainImage(id, res)
    }

}