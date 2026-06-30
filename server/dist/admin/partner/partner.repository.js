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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerRepository = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../../user/entity/users.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const partner_profiles_entity_1 = require("../../partner/entity/partner-profiles.entity");
let PartnerRepository = class PartnerRepository {
    usersRepository;
    partnerProfiles;
    constructor(usersRepository, partnerProfiles) {
        this.usersRepository = usersRepository;
        this.partnerProfiles = partnerProfiles;
    }
    async getList(dto) {
        const { page = 0, size = 20, q, orderColumn, orderSort } = dto;
        const queryBuilder = this.usersRepository.createQueryBuilder('u')
            .leftJoinAndSelect('u.partnerProfile', 'partnerProfile')
            .leftJoinAndSelect('partnerProfile.certifications', 'certifications')
            .where('u.userType = :userType', { userType: 'PARTNER' })
            .skip(page)
            .take(size);
        if (orderColumn && orderSort) {
            queryBuilder.orderBy(orderColumn, orderSort);
        }
        else {
            queryBuilder.orderBy('u.createdAt', 'DESC');
        }
        const [data, total] = await queryBuilder.getManyAndCount();
        // console.log(data)
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }
};
exports.PartnerRepository = PartnerRepository;
exports.PartnerRepository = PartnerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(partner_profiles_entity_1.PartnerProfiles)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PartnerRepository);
//# sourceMappingURL=partner.repository.js.map