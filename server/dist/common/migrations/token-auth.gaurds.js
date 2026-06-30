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
exports.TokenAdminAuthGuard = exports.TokenAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../user/entity/users.entity");
const typeorm_2 = require("typeorm");
const users_enum_1 = require("../enum/users.enum");
const partner_profiles_entity_1 = require("../../partner/entity/partner-profiles.entity");
let TokenAuthGuard = class TokenAuthGuard {
    jwtService;
    usersRepository;
    partnerProfilesRepository;
    constructor(jwtService, usersRepository, partnerProfilesRepository) {
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
        this.partnerProfilesRepository = partnerProfilesRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['access-token'];
        try {
            if (!token)
                new common_1.ForbiddenException('허용되지 않은 요청입니다.');
            const decoded = await this.jwtService.verifyAsync(token);
            const user = await this.usersRepository.createQueryBuilder('user')
                .where('user.id = :id', { id: decoded.id })
                .getOne();
            if (!user) {
                throw new common_1.ForbiddenException('허용되지 않은 요청입니다.');
            }
            else {
                if (!user.isActive) {
                    throw new common_1.ForbiddenException('허용되지 않은 요청입니다.');
                }
                if (user.userType == users_enum_1.UserType.PARTNER) {
                    const profile = await this.partnerProfilesRepository.createQueryBuilder('profile')
                        .where('profile.userId = :userId', { userId: user.id })
                        .getOne();
                    if (!profile || !profile?.isVerified) {
                        throw new common_1.ForbiddenException('허용되지 않은 요청입니다.');
                    }
                }
            }
            return true;
        }
        catch (error) {
            const response = context.switchToHttp().getResponse();
            await response.cookie('access-token', null, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                path: '/',
                maxAge: 0,
            });
            throw new common_1.ForbiddenException('허용되지 않은 요청입니다.');
        }
    }
};
exports.TokenAuthGuard = TokenAuthGuard;
exports.TokenAuthGuard = TokenAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(partner_profiles_entity_1.PartnerProfiles)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TokenAuthGuard);
let TokenAdminAuthGuard = class TokenAdminAuthGuard {
    jwtService;
    usersRepository;
    constructor(jwtService, usersRepository) {
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['access-token'];
        if (!token) {
            throw new common_1.ForbiddenException();
        }
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            const admin = await this.usersRepository.findOne({
                where: { id: decoded.id }
            });
            if (!admin) {
                throw new common_1.ForbiddenException();
            }
            request.admin = admin;
            return true;
        }
        catch {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.TokenAdminAuthGuard = TokenAdminAuthGuard;
exports.TokenAdminAuthGuard = TokenAdminAuthGuard = __decorate([
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], TokenAdminAuthGuard);
//# sourceMappingURL=token-auth.gaurds.js.map