import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UnsupportedMediaTypeException, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { Response, Request } from 'express';
import { UserService } from "../user/user.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { DecryptAndValidateSignupPipe } from "./pipes/auth.signup.pipe";
import { AuthService } from "./auth.service";
import { SigninRequestDto } from "./dto/auth-signin.dto";
import { DecryptAndValidateSigninPipe } from "./pipes/auth.signin.pipe";
import { SigninResponseDto } from "./dto/data/auth-signin-data.dto";
import { DecryptAndValidateCheckIdentityPipe } from "./pipes/auth-check-identity.pipe";
import { RecoverIdentityResponseDto } from "./dto/data/auth-recover-identity-data.dto";
import { CheckIdentityRequestDto } from "./dto/auth-check-identity.dto";
import { recoverIdentityRequestDto } from "./dto/auth-recover-identity.dto";
import { DecryptAndValidateRecoverIdentityPipe } from "./pipes/auth-recover-identity.pipe";
import { DecryptAndValidateResetPasswordComfirmPipe } from "./pipes/auth.reset-password-comfirm.pipe";
import { ResetPasswordComfirmRequestDto } from "./dto/auth-reset-password-comfirm.dto";
import { SignupRequestDto } from "./dto/auth-signup.dto";
import { SignoutRequestDto } from "./dto/auth-signout.dto";
import { RealIP } from "nestjs-real-ip";
import { UserType } from "../common/enum/user.enum";
import { Token } from "../common/token.decorator";
import { TokenAuthGuard } from "../common/gaurds/token-auth.gaurds";

@ApiTags('보안')
@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly UserService: UserService,
        private readonly authService: AuthService,
    ) {}

    // 회원가입
    @Post('/signup')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '회원 가입(신청)',
        description: '일반(유저)가입, 파트너 가입신청',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        // /okDataDto: SignupRequestDto
        requestBodyDtos: [SignupRequestDto],
        requestBodyDescription: 'SignupType(userType)에 따라 요청 DTO가 달라집니다.',
        consumes: 'multipart/form-data'
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'profileImage', maxCount: 1 },
            { name: 'businessRegistrationImage', maxCount: 1 },
            { name: 'licenseImage', maxCount: 1 },
        ],
        {
            limits: {
                fileSize: 10 * 1024 * 1024, // 전체 최대치
            },
            fileFilter: (req, file, cb) => {
                if (file.fieldname === 'profileImage') {
                    if (!file.mimetype.match(/(jpg|jpeg|png)$/)) {
                        return cb(
                            new UnsupportedMediaTypeException('프로필 사진 jpg, png 파일만 업로드 가능합니다.'),
                            false,
                        );
                    }
                }

                if (file.fieldname === 'businessRegistrationImage') {
                    if (!file.mimetype.match(/(jpg|jpeg|png|pdf)$/)) {
                        return cb(
                            new UnsupportedMediaTypeException('사업자등록증 jpg, png, pdf 파일만 업로드 가능합니다.'),
                            false,
                        );
                    }
                }


                if (file.fieldname === 'licenseImage') {
                    if (!file.mimetype.match(/(jpg|jpeg|png|pdf)$/)) {
                        return cb(
                            new UnsupportedMediaTypeException('자격증 사진 jpg, png, pdf 파일만 업로드 가능합니다.'),
                            false,
                        );
                    }
                }


                cb(null, true); 
            }
        }),
    )
    async signup(
        @Body(DecryptAndValidateSignupPipe) dto: SignupRequestDto,
        @UploadedFiles()
        files: {
            profileImage?: Express.Multer.File[];
        },
    ) {
        const profileImage = files?.profileImage?.[0];
        return await this.UserService.createUser(dto, profileImage);
        
    }

    //로그인
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '일반 로그인',
        description: '일반(유저), 파트너, 관리자 로그인',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: SigninResponseDto,
        requestBodyDtos: [SigninRequestDto],
    })
    async login(
        @Body(DecryptAndValidateSigninPipe) dto: SigninRequestDto,  
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request, 
        @RealIP() ip: string) {
        return await this.authService.signin(dto, res, req, ip);
    }

    //아이디 중복 체크
    @Post('/check-identity')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '아이디 중복검사',
        description: '회원가입(신청)시 아이디 중복 검사',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [CheckIdentityRequestDto],
    })
    async checkIdentity(@Body(DecryptAndValidateCheckIdentityPipe) dto: CheckIdentityRequestDto) {
        return await this.authService.checkIdentity(dto)
    }

    //아이디 찾기
    @Post('/recover-identity')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '아이디 찾기',
        description: '잊어버린 아이디 찾기',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: RecoverIdentityResponseDto,
        requestBodyDtos: [recoverIdentityRequestDto],
    })
    async recoverIdentity(@Body(DecryptAndValidateRecoverIdentityPipe) dto: recoverIdentityRequestDto) {
        return await this.authService.recoverIdentity(dto)
    }

    @Post('/reset-password/request')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '패스워드 찾기',
        description: '아이디와 번호로 정보 확인',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [CheckIdentityRequestDto],
    })
    async resetPasswordRequest(@Body(DecryptAndValidateCheckIdentityPipe) dto: CheckIdentityRequestDto) {
        return await this.authService.resetPasswordRequeset(dto)
    }

    @Post('/reset-password/confirm')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '패스워드 찾기',
        description: '패스워드 정보 확인 후 패스워드 변경',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [ResetPasswordComfirmRequestDto],
    })
    async resetPasswordConfirm(@Body(DecryptAndValidateResetPasswordComfirmPipe) dto: ResetPasswordComfirmRequestDto) {
        return await this.authService.resetPasswordComfirm(dto)
    }

    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '로그아웃',
        description: '토큰 파기 및 로그아웃',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos: [SignoutRequestDto]
    })
    async logout(
        @Body() dto: SignoutRequestDto,
        @Token([UserType.USER, UserType.ADMIN, UserType.PARTNER]) token:any,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @RealIP() ip: string
    ) {
        return await this.authService.logout(dto, token, req, res, ip);
    }

    //알람
    // @ApiExcludeEndpoint()
    // @Post('/alarm/select')
    // async alarmSelect(
    //     @Token([UserType.USER, UserType.PARTNER]) token:any) 
    // {
    //     return await this.authService.alarmSelect(token);
    // }

    @ApiExcludeEndpoint()
    @Get('/partner/profile/view/:id')
    async partnerProfileImageView(@Param('id') id: number, @Res() res: Response) {
        return await this.authService.getPartnerProfileImage(id, res)
    }

}