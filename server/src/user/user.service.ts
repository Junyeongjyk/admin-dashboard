import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { handleSend, log } from "../config/log.tools.config";
import { UserRepository } from "./user.repository";
import { User } from "./entity/user.entity";
import { getHex512 } from "../common/functions/common";
import { Gender, SignupPath, UserType } from "../common/enum/users.enum";
import { PartnerRepository } from "../partner/partner.repository";
import { saveUploadedFile } from "../common/functions/file-save.util";
import { UserDeleteMeDto } from "./dto/users-delete-me.dto";
import { UserAlamRequestDto } from "./dto/users-alam.dto";
import { SignupRequestDto } from "../auth/dto/auth-signup.dto";
import { createKey, encrypt } from "../common/functions/aes.util";
import { UserUpdateRequestDto } from "./dto/users-update.dto";
import { UserUpdatePasswordRequestDto } from "./dto/users-update-password.dto";
import { FilePath } from "../common/enum/common.enum";
import { PartnerProfiles } from "../partner/entity/partner-profiles.entity";
import { RealtimeCredentialService } from "../mqtt/realtime-credential.service";
import { Sign } from "../common/sign.helper";
import { Response } from 'express';

@Injectable()
export class UserService {

    constructor(
        private readonly usersRepository: UserRepository,
        private readonly partnerRepository: PartnerRepository,
        private readonly realtimeCredentialService: RealtimeCredentialService,
        private sign: Sign,
    ) {}

    async createUser(
        dto: SignupRequestDto,
        profileImage?: Express.Multer.File,
        businessRegistrationImage?: Express.Multer.File,
        licenseImage?: Express.Multer.File,
    ) {
        try {
            
            //아이디 중복 검사
            if (dto.provider == SignupPath.NORMAL) {
                //이메일 중복 검사
                const isAvailable  = await this.usersRepository.isIdentityAvailable(dto.plainIdentity);
                if (!isAvailable ) {
                    throw new ConflictException('이미 존재하는 아이디입니다.');
                } 
            } else {
                //snsid 중복검사
                const isSnsAvailable =  await this.usersRepository.isSnsAvailable(dto.plainProviderUserId)
                if (!isSnsAvailable ) {
                    throw new ConflictException('이미 존재하는 아이디입니다.');
                } 
            }

            if (dto.userType === UserType.PARTNER) {
                if (!profileImage) {
                    throw new BadRequestException('프로필 사진은 필수입니다.');
                }

                if (profileImage && profileImage.size > 2 * 1024 * 1024) {
                    throw new PayloadTooLargeException('프로필 사진은 최대 2MB까지 업로드 가능합니다.');
                }

            }

            const user = new User();
            if(dto.provider == SignupPath.NORMAL) {
                user.identity = dto.plainIdentity
                user.password = getHex512(dto.plainPassword)
                user.email = dto.plainIdentity
            } else {
                user.identity = ''
                user.password = ''
                user.email = dto.plainEmail
            }

            user.name = dto.plainName
            user.phone = dto.plainPhoneNumber
            user.birthday = dto.birthDate
            user.gender = dto.gender
            user.userType = dto.userType

            user.isActive = dto.userType !== UserType.PARTNER ? true : false
            const userInfo = await this.usersRepository.saveUser(user)
            if (dto.userType === UserType.PARTNER) {

                const profile = new PartnerProfiles();
                profile.userId = userInfo.id;
                profile.user = userInfo;
                profile.nickname = !dto.nickname || dto.nickname == '' ? dto.plainName : dto.nickname;

                if (profileImage) {
                    const profileImageSaved = saveUploadedFile(profileImage, `${FilePath.PROFILE}${userInfo.id}`)
                    profile.profilePath = profileImageSaved.savedPath
                }
                const profileInfo = await this.partnerRepository.savePartnerProfiles(profile)
            }


            return handleSend()

        } catch (error) {
            log('[UserService] createUser', '회원가입 예러', error)
            // 이미 의도한 HTTP 예외는 그대로 전달
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('회원 가입 처리 중 오류가 발생했습니다.')
        }
    }

    async getUserInfo(token:any) {
        try {
            
            let info = await this.usersRepository.findById(token.id);
            if (!info) {
                throw new NotFoundException('회원정보  존재하지 않습니다.')
            }

            const key = createKey()
            info.identity = encrypt(key, info.identity)
            info.name = encrypt(key, info.name)
            info.address = encrypt(key, info.address)
            info.zipcode = encrypt(key, info.zipcode)
            info.email = encrypt(key, info.email)
            info.phone = encrypt(key, info.phone)

            return handleSend(info)


        } catch (error) {
            log('[UserService] getUserInfo', '회원정보 조회 예러', error)
            // 이미 의도한 HTTP 예외는 그대로 전달
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('회윈정보 조회 중 오류가 발생했습니다.')
        }
    }


    async updateUser(dto: UserUpdateRequestDto, token:any) {
        try {
          
            const userInfo = await this.usersRepository.findByIdInfo(token.id)
            if (!userInfo) {
                throw new NotFoundException('존재하지 않는 사용자 입니다.')
            }

            userInfo.email = dto.plainEmail
            userInfo.isEmailVerified = true
            userInfo.address = dto.plainAddress
            userInfo.detailAddress = dto.detailAddress
            userInfo.zipcode = dto.plainZipCode
            userInfo.phone = dto.plainPhone
            userInfo.gender = dto.gender as Gender

            await this.usersRepository.saveUser(userInfo)
            return handleSend()
            
        } catch (error) {
            log('[UserService] updateAddress',  '주소 변경 중 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('주소 변경 오류가 발생했습니다.')
        }
    }

    async updatePassword(dto: UserUpdatePasswordRequestDto, token:any) {
        try {
          
            const userInfo = await this.usersRepository.findByIdInfo(token.id)
            if (!userInfo) {
                throw new NotFoundException('존재하지 않는 사용자 입니다.')
            }

            if (!userInfo.identity) {
                userInfo.identity = dto.plainIdentity
            }

            userInfo.password = getHex512(dto.plainPassword)
            await this.usersRepository.saveUser(userInfo)
            
            return handleSend()
            
        } catch (error) {
            log('[UserService] updateAddress',  '주소 변경 중 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('주소 변경 오류가 발생했습니다.')
        }
    }



    async deleteMe(dto: UserDeleteMeDto, token:any, res: Response) {
        try {
            
            const userInfo = await this.usersRepository.findByIdInfo(token.id)
            if (!userInfo) {
                throw new NotFoundException('유저 또는 파트너정보가 존재하지 않습니다.')
            }
          
            //mtqq  자격증명 해제
            await this.realtimeCredentialService.revokeOnLogout({
                userId: token.id,
                deviceId: dto.deviceId
            })

            //액세스토큰 삭제
            await this.sign.out(res);

            userInfo.isActive = false
            userInfo.isDeleted = true
            userInfo.deletedAt = new Date()
            
            await this.usersRepository.saveUser(userInfo)
           
            return handleSend()
            
        } catch (error) {
            log('[UserService] deleteMe',  '계정 해지 중 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('계정 해지 오류가 발생했습니다.')
        }
    }

    // async settingAlam(dto: UserAlamRequestDto) {
    //      try {
    //         /**
    //          * TODO 유저별 알람 설정 
    //          * 알람 전송 여무 상태값 저장
    //          */
          
           
    //         return handleSend()
            
    //     } catch (error) {
    //         log('[UserService] deleteMe',  '알람 설정 중 오류가 발생했습니다.', error)
    
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
            
    //         throw new InternalServerErrorException('알람 설정 오류가 발생했습니다.')
    //     }
    // }

}