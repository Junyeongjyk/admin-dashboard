
import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./system.service";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { UserDeleteMeDto } from "./dto/users-delete-me.dto";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/users.enum";
import { UserInfoResponseDto } from "./dto/data/users-info-data.dto";
import { UserUpdateRequestDto } from "./dto/users-update.dto";
import { DecryptAndValidateUpdatePipe } from "./pipes/auth.update.pipe";
import { UserUpdatePasswordRequestDto } from "./dto/users-update-password.dto";
import { DecryptAndValidateUpdatePasswordPipe } from "./pipes/auth.update-password.pipe";
import { Response } from 'express';

@ApiTags('유저')
@Controller('/users')
@UseGuards(TokenAuthGuard)
export class UserController {

    constructor(
        private readonly usersService: UserService,
    ) {}

    @Post('/me')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '로그인 유저 정보조회',
        description: '프로필 정보 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: UserInfoResponseDto,
        //okDataDto: FilesDownloadResponseDto,
    })
    
    async userInfo(@Token([UserType.USER, UserType.PARTNER]) token:any) {
        return await this.usersService.getUserInfo(token);
    }

    
    
    @Patch('/me')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '프로필 정보 수정',
        description: '프로필 정보 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        //okDataDto: FilesDownloadResponseDto,
        requestBodyDtos: [UserUpdateRequestDto],
    })
    async updateMyProfile(
        @Body(DecryptAndValidateUpdatePipe) dto: UserUpdateRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.usersService.updateUser(dto, token);
    }

    @Patch('/me/password')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '패스워드 변경',
        description: '패스워드와 초기 아이디 등록',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        //okDataDto: FilesDownloadResponseDto,
        requestBodyDtos: [UserUpdatePasswordRequestDto],
    })
    async updateMyPassword(
        @Body(DecryptAndValidateUpdatePasswordPipe) dto: UserUpdatePasswordRequestDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any
    ) {
        return await this.usersService.updatePassword(dto, token);
    }

    @Delete('/me')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '계정해지',
        description: '회원 탈퇴(소프트 삭제/비활성)',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [UserDeleteMeDto],
    })
    async deleteMe(
        @Body() dto: UserDeleteMeDto,
        @Token([UserType.USER, UserType.PARTNER]) token:any,
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.usersService.deleteMe(dto, token, res);
    }
}

