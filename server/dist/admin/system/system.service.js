"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../config/log.tools.config");
const users_repository_1 = require("./users.repository");
const users_entity_1 = require("./entity/users.entity");
const common_2 = require("../common/functions/common");
const users_enum_1 = require("../common/enum/users.enum");
const partner_repository_1 = require("../partner/partner.repository");
const file_save_util_1 = require("../common/functions/file-save.util");
const aes_util_1 = require("../common/functions/aes.util");
const common_enum_1 = require("../common/enum/common.enum");
const partner_certifications_entity_1 = require("../partner/entity/partner-certifications.entity");
const partner_enum_1 = require("../common/enum/partner.enum");
const partner_profiles_entity_1 = require("../partner/entity/partner-profiles.entity");
const realtime_credential_service_1 = require("../mqtt/realtime-credential.service");
const sign_helper_1 = require("../common/sign.helper");
let UserService = class UserService {
    usersRepository;
    partnerRepository;
    realtimeCredentialService;
    sign;
    constructor(usersRepository, partnerRepository, realtimeCredentialService, sign) {
        this.usersRepository = usersRepository;
        this.partnerRepository = partnerRepository;
        this.realtimeCredentialService = realtimeCredentialService;
        this.sign = sign;
    }
    async createUser(dto, profileImage, businessRegistrationImage, licenseImage) {
        try {
            //아이디 중복 검사
            if (dto.provider == users_enum_1.SignupPath.NORMAL) {
                //이메일 중복 검사
                const isAvailable = await this.usersRepository.isIdentityAvailable(dto.plainIdentity);
                if (!isAvailable) {
                    throw new common_1.ConflictException('이미 존재하는 아이디입니다.');
                }
            }
            else {
                //snsid 중복검사
                const isSnsAvailable = await this.usersRepository.isSnsAvailable(dto.plainProviderUserId);
                if (!isSnsAvailable) {
                    throw new common_1.ConflictException('이미 존재하는 아이디입니다.');
                }
            }
            if (dto.userType === users_enum_1.UserType.PARTNER) {
                if (!profileImage) {
                    throw new common_1.BadRequestException('프로필 사진은 필수입니다.');
                }
                if (profileImage && profileImage.size > 2 * 1024 * 1024) {
                    throw new common_1.PayloadTooLargeException('프로필 사진은 최대 2MB까지 업로드 가능합니다.');
                }
            }
            const user = new users_entity_1.User();
            if (dto.provider == users_enum_1.SignupPath.NORMAL) {
                user.identity = dto.plainIdentity;
                user.password = (0, common_2.getHex512)(dto.plainPassword);
                user.email = dto.plainIdentity;
            }
            else {
                user.identity = '';
                user.password = '';
                user.email = dto.plainEmail;
            }
            user.name = dto.plainName;
            user.phone = dto.plainPhoneNumber;
            user.birthday = dto.birthDate;
            user.gender = dto.gender;
            user.userType = dto.userType;
            user.address = dto.plainAddress,
                user.detailAddress = dto.plainDetailAddress;
            user.zipcode = dto.plainZipCode;
            user.marketingAgreed = dto.marketingAgreed ? dto.marketingAgreed : false;
            user.isActive = dto.userType !== users_enum_1.UserType.PARTNER ? true : false;
            const userInfo = await this.usersRepository.saveUser(user);
            if (dto.userType === users_enum_1.UserType.PARTNER) {
                const profile = new partner_profiles_entity_1.PartnerProfiles();
                profile.userId = userInfo.id;
                profile.user = userInfo;
                profile.nickname = !dto.nickname || dto.nickname == '' ? dto.plainName : dto.nickname;
                profile.businessCeo = dto.businessCeo ?? '';
                profile.businessAddress = dto.businessAddress;
                profile.businessDetailAddress = dto.businessDetailAddress;
                profile.businessNumber = dto.businessRegistrationNumber;
                profile.businessZipcode = dto.businessZipCode;
                profile.introduction = dto.introduction;
                profile.careerYears = dto.careerYears ?? 0;
                profile.region = dto.mainActivityRegion;
                profile.minimumFee = dto.fee;
                profile.businessName = dto.businessName;
                if (profileImage) {
                    const profileImageSaved = (0, file_save_util_1.saveUploadedFile)(profileImage, `${common_enum_1.FilePath.PROFILE}${userInfo.id}`);
                    profile.profilePath = profileImageSaved.savedPath;
                }
                if (businessRegistrationImage) {
                    const businessRegistrationImageSaved = (0, file_save_util_1.saveUploadedFile)(businessRegistrationImage, `${common_enum_1.FilePath.BUSINESS}${userInfo.id}`);
                    profile.businessFilePath = businessRegistrationImageSaved.savedPath;
                }
                const profileInfo = await this.partnerRepository.savePartnerProfiles(profile);
                if (licenseImage) { // 
                    const licenseImageImageSaved = (0, file_save_util_1.saveUploadedFile)(licenseImage, `${common_enum_1.FilePath.LICENSE}${userInfo.id}`);
                    const certification = new partner_certifications_entity_1.PartnerCertification();
                    certification.partnerId = profileInfo.id;
                    certification.certType = '';
                    certification.certFileUrl = licenseImageImageSaved.savedPath;
                    certification.status = partner_enum_1.PartnerCertificationStatus.PENDING;
                    await this.partnerRepository.savePartnerCertification(certification);
                }
            }
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[UserService] createUser', '회원가입 예러', error);
            // 이미 의도한 HTTP 예외는 그대로 전달
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('회원 가입 처리 중 오류가 발생했습니다.');
        }
    }
    async getUserInfo(token) {
        try {
            let info = await this.usersRepository.findById(token.id);
            if (!info) {
                throw new common_1.NotFoundException('회원정보  존재하지 않습니다.');
            }
            const key = (0, aes_util_1.createKey)();
            info.identity = (0, aes_util_1.encrypt)(key, info.identity);
            info.name = (0, aes_util_1.encrypt)(key, info.name);
            info.address = (0, aes_util_1.encrypt)(key, info.address);
            info.zipcode = (0, aes_util_1.encrypt)(key, info.zipcode);
            info.email = (0, aes_util_1.encrypt)(key, info.email);
            info.phone = (0, aes_util_1.encrypt)(key, info.phone);
            return (0, log_tools_config_1.handleSend)(info);
        }
        catch (error) {
            (0, log_tools_config_1.log)('[UserService] getUserInfo', '회원정보 조회 예러', error);
            // 이미 의도한 HTTP 예외는 그대로 전달
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('회윈정보 조회 중 오류가 발생했습니다.');
        }
    }
    async updateUser(dto, token) {
        try {
            const userInfo = await this.usersRepository.findByIdInfo(token.id);
            if (!userInfo) {
                throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
            }
            userInfo.email = dto.plainEmail;
            userInfo.isEmailVerified = true;
            userInfo.address = dto.plainAddress;
            userInfo.detailAddress = dto.detailAddress;
            userInfo.zipcode = dto.plainZipCode;
            userInfo.phone = dto.plainPhone;
            userInfo.isNotificationAgreed = dto.notification;
            userInfo.isTwoFactorEnabled = dto.twoFactor;
            userInfo.gender = dto.gender;
            await this.usersRepository.saveUser(userInfo);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[UserService] updateAddress', '주소 변경 중 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('주소 변경 오류가 발생했습니다.');
        }
    }
    async updatePassword(dto, token) {
        try {
            const userInfo = await this.usersRepository.findByIdInfo(token.id);
            if (!userInfo) {
                throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
            }
            if (!userInfo.identity) {
                userInfo.identity = dto.plainIdentity;
            }
            userInfo.password = (0, common_2.getHex512)(dto.plainPassword);
            await this.usersRepository.saveUser(userInfo);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[UserService] updateAddress', '주소 변경 중 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('주소 변경 오류가 발생했습니다.');
        }
    }
    async deleteMe(dto, token, res) {
        try {
            const userInfo = await this.usersRepository.findByIdInfo(token.id);
            if (!userInfo) {
                throw new common_1.NotFoundException('유저 또는 파트너정보가 존재하지 않습니다.');
            }
            //mtqq  자격증명 해제
            await this.realtimeCredentialService.revokeOnLogout({
                userId: token.id,
                deviceId: dto.deviceId
            });
            //액세스토큰 삭제
            await this.sign.out(res);
            userInfo.isActive = false;
            userInfo.isDeleted = true;
            userInfo.deletedAt = new Date();
            await this.usersRepository.saveUser(userInfo);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[UserService] deleteMe', '계정 해지 중 오류가 발생했습니다.', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('계정 해지 오류가 발생했습니다.');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UserRepository !== "undefined" && users_repository_1.UserRepository) === "function" ? _a : Object, partner_repository_1.PartnerRepository, typeof (_b = typeof realtime_credential_service_1.RealtimeCredentialService !== "undefined" && realtime_credential_service_1.RealtimeCredentialService) === "function" ? _b : Object, typeof (_c = typeof sign_helper_1.Sign !== "undefined" && sign_helper_1.Sign) === "function" ? _c : Object])
], UserService);
//# sourceMappingURL=system.service.js.map