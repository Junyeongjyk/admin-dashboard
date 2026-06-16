
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../../config/swagger/api-response.decorator";
import { PartnersService } from "./partner.service";
import { PartnerApprovalRequestDto } from "./dto/partner-approval.dto";
import { PartnerLocationRequestDto } from "./dto/partner-location.dto";
import { PartnerLocationResponsetDto } from "./dto/data/partner-location.dto";
import { UserListRequestDto } from "../user/dto/user-list.dto";
import { UserListResponseDto } from "../user/dto/data/user-list-data.dto";
import { Token } from "../../common/token.decorator";
import { handleSend, log } from "../../config/log.tools.config";
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('관리자 - 파트너 관리')
@Controller('/admin/partner')
export class PartnersController {

    constructor(
        private readonly partnerService: PartnersService
    ) {}
    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '파트너 리스트',
        description: '파트너 리스트 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: UserListResponseDto,
        requestBodyDtos: [UserListRequestDto],
    })
    async getList(@Body() dto: UserListRequestDto) {
        return await this.partnerService.getList(dto)
    }
    
    @Post('/approval')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '파트너 회원가입 승인/거부',
        description: '파트너 회원가입 신청 건을 승인 또는 거부 처리',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [PartnerApprovalRequestDto],
    })
    async approvePartner(@Body() dto: PartnerApprovalRequestDto) {
        return await this.partnerService.approvePartner(dto)
    }

}