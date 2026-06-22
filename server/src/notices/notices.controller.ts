
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { NoticesService } from "./notices.service";
import { NoticesClientListResponseDto } from "./dto/data/notices-list-data.dto";
import { NoticesClientDetailResponseDto } from "./dto/data/notices-detail-data.dto";
import { NoticesListRequestDto } from "./dto/notices-list.dto";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/users.enum";

@ApiTags('공지사항')
@Controller('notices')
export class NoticesController {
    
    constructor(
        private readonly noticesService: NoticesService,
    ) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '공지사항 목록 조회',
        description: '회원 유형별 공지사항 목록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: NoticesClientListResponseDto,
        requestBodyDtos: [NoticesListRequestDto],
    })
    @UseGuards(TokenAuthGuard)
    async noticesList(@Body() dto: NoticesListRequestDto, @Token([UserType.USER, UserType.DETECTIVE]) token:any) {
        return await this.noticesService.getList(dto, token);
    }

    @Get('/:noticeId')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '공지사항 내용확인',
        description: '공지사항 상세정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: NoticesClientDetailResponseDto,
        pathParams:[
            {name: 'noticeId', description: '공지사항 PK', example: 1 }
        ]
    })
    @UseGuards(TokenAuthGuard)
    async noticesDetail(@Param('noticeId') noticeId: number, @Token([UserType.USER, UserType.PARTNER]) token:any) {
        return await this.noticesService.getDetail(noticeId, token);
    }
}