import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { LogService } from "./log.service";
import { LogUserRequestDto } from "./dto/log-user.dto";
import { LogUserResponseDto } from "./dto/data/log-user-data.dto";

@ApiTags('관리자 - 로그관리')
@Controller('/admin/log')
export class LogController {
    
    constructor(
        private readonly logService: LogService,
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '유저 접속로그 확인',
        description: '로그 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: LogUserResponseDto,
        requestBodyDtos: [LogUserRequestDto],
    })
    async getLoninLogs(@Body() dto: LogUserRequestDto) {
        return await this.logService.getLoginLogs(dto);
    }
    

    // @Post('/system')
    // @HttpCode(HttpStatus.OK)
    // @ApiStdResponses({
    //     summary: '시스템로그 확인',
    //     description: '로그 조회',
    //     okExampleCode: 'SUCCESS',
    //     okExampleMessage: '요청 성공',
    //     okDataDto: LogUserResponseDto,
    //     requestBodyDtos: [LogUserRequestDto],
    // })
    // async getSystemLogs(@Body() dto: LogUserRequestDto) {
    //     return await this.logService.getSystemLogs(dto);
    // }
}