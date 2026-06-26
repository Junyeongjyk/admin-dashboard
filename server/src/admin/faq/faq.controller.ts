
import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FaqsService } from "./faqs.service";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { FaqsCreateRequestDto } from "./dto/faqs-create.dto";
import { FaqsCreateResponseDto } from "./dto/data/faqs-create-data.dto";
import { FaqsUpdateResponseDto } from "./dto/data/faqs-update-data.dto";
import { FaqsUpdateRequestDto } from "./dto/faqs-update.dto";
import { FaqsDeleteRequestDto } from "./dto/faqs-delete.dto";
import { FaqsSearchRequestDto } from "./dto/faqs-search.dto";
import { Token } from "../../common/token.decorator";

@ApiTags('관리자 - FAQ관리')
@Controller('/admin/faqs')
export class FaqsController {

    constructor(
        private readonly faqsService: FaqsService,
    ) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: 'FAQ 등록',
        description: 'FAQ 신규 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: FaqsCreateResponseDto,
        requestBodyDtos: [FaqsCreateRequestDto],
    })
    async createFaq(@Body() dto: FaqsCreateRequestDto, @Token("ADMIN") token:any) {
        return await this.faqsService.createFaq(dto, token)
    }

    // @Patch('/')
    // @HttpCode(HttpStatus.OK)
    // @ApiStdResponses({
    //     summary: 'FAQ 수정',
    //     description: 'FAQ 수정(부분 수정 가능)',
    //     okExampleCode: 'SUCCESS',
    //     okExampleMessage: '요청 성공',
    //     okDataDto: FaqsUpdateResponseDto,
    //     requestBodyDtos: [FaqsUpdateRequestDto],
    // })
    // async updateFaq(@Body() dto: FaqsUpdateRequestDto) {
    //     return await this.faqsService.updateFaq(dto)
    // }

    @Delete('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: 'FAQ 삭제',
        description: 'FAQ 삭제(soft delete)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: FaqsCreateResponseDto,
        requestBodyDtos: [FaqsDeleteRequestDto],
    })
    async deleteFaq(@Body() dto: FaqsDeleteRequestDto) {
        console.log(dto)
        return await this.faqsService.deleteFaq(dto)
    }

    @Post('/search')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: 'FAQ 목록 조회(관리자)',
        description: '관리자용 FAQ 목록 조회(비공개 포함)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: FaqsCreateResponseDto,
        requestBodyDtos: [FaqsSearchRequestDto],
    })
    async searchFaq(@Body() dto: FaqsSearchRequestDto) {
        return await this.faqsService.searchFaq(dto)
    }
}