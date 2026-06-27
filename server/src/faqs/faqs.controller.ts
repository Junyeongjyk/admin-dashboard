
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { FaqsListRequestDto } from "./dto/faqs-list.dto";
import { FaqsService } from "./faqs.service";
import { FaqsListResponseDto } from "./dto/data/faqs-list-data.dto";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/users.enum";

@ApiTags('FAQ')
@Controller('faqs')
@UseGuards(TokenAuthGuard)
export class FaqsController {

    constructor(
        private readonly faqsService: FaqsService,
    ) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: 'FAQ 조회',
        description: ' 목록 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: FaqsListResponseDto,
        requestBodyDtos: [FaqsListRequestDto],
    })
    async faqsList(@Body() dto: FaqsListRequestDto, @Token([UserType.CLIENT, UserType.PARTNER]) token:any) {
        return await this.faqsService.getList(dto)
    }

}