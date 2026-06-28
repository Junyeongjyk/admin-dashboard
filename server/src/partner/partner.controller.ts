import { Body, Controller, HttpCode, HttpStatus, Post, Patch, Req, UnsupportedMediaTypeException } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { ApiStdResponses } from "../config/swagger/api-response.decorator";
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { UseInterceptors, UploadedFiles } from '@nestjs/common'
import { PartnerService } from "./partner.service";
import { Token } from "../common/token.decorator";
import { UserType } from "../common/enum/users.enum";
import { PartnerUpdateProfileRequestDto } from "./dto/partner-update-profile.dto";

@ApiTags('파트너')
@Controller('partner')
export class PartnerController {
    
    constructor(
        private readonly partnerService: PartnerService,
    ) {}

    @Post('/me')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '내 파트너정보 확인',
        description: '로그인한 파트너 프로필 조회',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        okDataDto: PartnerProfileResponseDto,
    })
    async getMyPartnerInfo(
        @Token(UserType.PARTNER) token: any
    ) {
        return await this.partnerService.getMePartnerProfile(token);
    }

    @Patch('/me')
    @HttpCode(HttpStatus.OK)
    @ApiStdResponses({
        summary: '파트너 프로필 수정',
        description: '내 파트너 프로필 수정',
        okExampleCode: 'SUCCESS',
        okExampleMessage: '요청 성공',
        requestBodyDtos:[PartnerUpdateProfileRequestDto]
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'profileImage', maxCount: 1 },
            { name: 'businessRegistrationImage', maxCount: 1 },
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
            }
        }),
    )
    async updateMyPartnerInfo(
        @Body() dto: PartnerUpdateProfileRequestDto,
        @Token(UserType.PARTNER) token:any,
        @UploadedFiles()
        files: {
            profileImage?: Express.Multer.File[];
            businessRegistrationImage?: Express.Multer.File[];
        }
    ) {
        const profileImage = files?.profileImage?.[0];
        const businessRegistrationImage = files?.businessRegistrationImage?.[0];
        return await this.partnerService.updatePartnerProfile(dto,token, profileImage, businessRegistrationImage);
    }


}