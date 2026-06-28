import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { handleSend, log } from "../config/log.tools.config";
import { PartnerRepository } from "./partner.repository";
import { MqttPublisherService } from "../mqtt/mqtt.service";
import { PartnerUpdateProfileRequestDto } from "./dto/partner-update-profile.dto";
import { saveUploadedFile } from "../common/functions/file-save.util";
import { FilePath } from "../common/enum/common.enum";

@Injectable()
export class PartnerService {
    
    constructor(
        private readonly partnerRepository: PartnerRepository,
        private readonly mqttPublisherService: MqttPublisherService,
    ) {}

    async getMePartnerProfile(token: any) {
        try {

            const profile = await this.partnerRepository.findByUserid(token.id)

            if (!profile) {
                throw new BadRequestException('파트너 프로필이 없습니다.')
            }

            return handleSend({
                id: profile.id,
                nickname: profile.nickname,
            })

        } catch (error) {

            log('[PartnerService] getMePartnerProfile', '내 파트너 프로필 조회 에러', error)

            if (error instanceof HttpException) {
                throw error
            }

            throw new InternalServerErrorException('내 파트너 프로필 조회 오류가 발생했습니다.')
        }
    }
    
    async updatePartnerProfile(
        dto:PartnerUpdateProfileRequestDto, 
        token:any,
        profileImage?: Express.Multer.File,
    ) {
        try {

            const profile = await this.partnerRepository.findByUserid(token.id)

            if (!profile) {
                throw new BadRequestException('파트너 프로필이 없습니다.')
            }

            if (profile.userId !== token.id || profile.id !== dto.id) {
                throw new ForbiddenException('프로필 수정권한이 없습니다.')
            }

            profile.nickname = dto.nickname

            if (profileImage) {
                const profileImageSaved = saveUploadedFile(profileImage, `${FilePath.PROFILE}${token.id}`)
                profile.profilePath = profileImageSaved.savedPath
            }
            
            await this.partnerRepository.savePartnerProfiles(profile)

            return handleSend()

        } catch (error) {

            log('[PartnerService] updatePartnerProfile', '파트너 프로필 수정 에러', error)

            if (error instanceof HttpException) {
                throw error
            }

            throw new InternalServerErrorException('파트너 프로필 수정 오류가 발생했습니다.')
        }
    }
   

    
}