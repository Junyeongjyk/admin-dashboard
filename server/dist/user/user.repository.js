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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entity/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_auth_histories_entity_1 = require("./entity/user-auth-histories.entity");
const users_enum_1 = require("../common/enum/users.enum");
let UserRepository = class UserRepository {
    usersRepository;
    userAuthHistoriesRepository;
    constructor(usersRepository, userAuthHistoriesRepository) {
        this.usersRepository = usersRepository;
        this.userAuthHistoriesRepository = userAuthHistoriesRepository;
    }
    async saveUser(user) {
        return await this.usersRepository.save(user);
    }
    async saveUserAuthHistories(userAuthHistories) {
        return await this.userAuthHistoriesRepository.save(userAuthHistories);
    }
    async isIdentityAvailable(identity) {
        const count = await this.usersRepository.createQueryBuilder('user')
            .where('LOWER(user.identity) = LOWER(:identity)', { identity })
            .getCount();
        return count <= 0;
    }
    async findByIdentity(identity) {
        return await this.usersRepository.createQueryBuilder('user')
            .where('LOWER(user.identity) = LOWER(:identity)', { identity })
            .getOne();
    }
    async findById(id) {
        return await this.usersRepository.createQueryBuilder('u')
            .leftJoin('u.partnerProfile', 'd')
            .select([
            'u.id AS id',
            'u.identity AS identity',
            'u.name AS name',
            'u.email AS email',
            'd.nickname AS nickname',
            'u.user_type AS "userType"',
            'u.email AS email',
            'u.phone as phone',
            'u.gender AS gender'
        ])
            .where('u.id = :id', { id })
            .getRawOne();
    }
    async findByIdInfo(id) {
        return await this.usersRepository.createQueryBuilder('u')
            .where('u.id = :id', { id })
            .getOne();
    }
    async findByNamePhone(name, phone) {
        return await this.usersRepository.createQueryBuilder('user')
            .where('user.user_type <> :userType', { userType: users_enum_1.UserType.ADMIN })
            .andWhere('user.name = :name', { name })
            .andWhere('user.phone = :phone', { phone })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
            .getOne();
    }
    async findByIdentityPhone(identity, phone) {
        return await this.usersRepository.createQueryBuilder('user')
            .where('user.user_type <> :userType', { userType: users_enum_1.UserType.ADMIN })
            .andWhere('user.identity = :identity', { identity })
            .andWhere('user.phone = :phone', { phone })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
            .getOne();
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_auth_histories_entity_1.UserAuthHistories)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map