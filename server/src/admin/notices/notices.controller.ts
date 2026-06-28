import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NoticesService } from "./notices.service";
import { NoticesListResponseDto } from "./dto/data/notices-list-data.dto";
import { NoticesDetailResponseDto } from "./dto/data/notices-detail-data.dto";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { NoticesListRequestDto } from "./dto/notices-list.dto";
import { NoticesDeleteRequestDto } from "./dto/notices-delete.dto";
import { NoticesCreateRequestDto } from "./dto/notices-create.dto";
import { Token } from "../../common/token.decorator";

@ApiTags('관리자 - 공지사항 관리')
@Controller('/admin/notices')
export class NoticesController {
    
    constructor(
        private readonly noticesService: NoticesService,
    ) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '공지사항 목록 조회',
        description: '관리자 공지사항 목록조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: NoticesListResponseDto,
        requestBodyDtos: [NoticesListRequestDto],
    })
    async noticesList(@Body() dto: NoticesListRequestDto) {
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

    @Delete('/delete')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '공지사항 삭제',
        description: '관리자 공지사항 삭제',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [NoticesDeleteRequestDto]
    })
    async noticesDelete(@Body() dto: NoticesDeleteRequestDto) {
        return await this.noticesService.noticesDelete(dto);
    }

    @Post('/create')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '공지사항 등록',
        description: '공지사항 등록(대상: 파트너/의뢰인/전체, 필수 공지 여부 포함)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [NoticesCreateRequestDto],
    })
    async noticesCreate(@Body() dto: NoticesCreateRequestDto, @Token("ADMIN") token:any) {
    // async noticesCreate(@Body() dto: NoticesCreateRequestDto) {
    //     let token = null;
        // console.log(token)
        return await this.noticesService.noticesCreate(dto, token);
    }
}