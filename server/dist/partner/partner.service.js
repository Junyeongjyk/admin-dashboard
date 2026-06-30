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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const common_1 = require("@nestjs/common");
const log_tools_config_1 = require("../config/log.tools.config");
const partner_repository_1 = require("./partner.repository");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const file_save_util_1 = require("../common/functions/file-save.util");
const common_enum_1 = require("../common/enum/common.enum");
let PartnerService = class PartnerService {
    partnerRepository;
    mqttPublisherService;
    constructor(partnerRepository, mqttPublisherService) {
        this.partnerRepository = partnerRepository;
        this.mqttPublisherService = mqttPublisherService;
    }
    async getMePartnerProfile(token) {
        try {
            const profile = await this.partnerRepository.findByUserid(token.id);
            if (!profile) {
                throw new common_1.BadRequestException('파트너 프로필이 없습니다.');
            }
            return (0, log_tools_config_1.handleSend)({
                id: profile.id,
                nickname: profile.nickname,
            });
        }
        catch (error) {
            (0, log_tools_config_1.log)('[PartnerService] getMePartnerProfile', '내 파트너 프로필 조회 에러', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('내 파트너 프로필 조회 오류가 발생했습니다.');
        }
    }
    async updatePartnerProfile(dto, token, profileImage) {
        try {
            const profile = await this.partnerRepository.findByUserid(token.id);
            if (!profile) {
                throw new common_1.BadRequestException('파트너 프로필이 없습니다.');
            }
            if (profile.userId !== token.id || profile.id !== dto.id) {
                throw new common_1.ForbiddenException('프로필 수정권한이 없습니다.');
            }
            profile.nickname = dto.nickname;
            if (profileImage) {
                const profileImageSaved = (0, file_save_util_1.saveUploadedFile)(profileImage, `${common_enum_1.FilePath.PROFILE}${token.id}`);
                profile.profilePath = profileImageSaved.savedPath;
            }
            await this.partnerRepository.savePartnerProfiles(profile);
            return (0, log_tools_config_1.handleSend)();
        }
        catch (error) {
            (0, log_tools_config_1.log)('[PartnerService] updatePartnerProfile', '파트너 프로필 수정 에러', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('파트너 프로필 수정 오류가 발생했습니다.');
        }
    }
};
exports.PartnerService = PartnerService;
exports.PartnerService = PartnerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [partner_repository_1.PartnerRepository, typeof (_a = typeof mqtt_service_1.MqttPublisherService !== "undefined" && mqtt_service_1.MqttPublisherService) === "function" ? _a : Object])
], PartnerService);
//# sourceMappingURL=partner.service.js.map