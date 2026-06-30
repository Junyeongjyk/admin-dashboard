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
exports.LogRepository = void 0;
const common_1 = require("@nestjs/common");
const user_auth_histories_entity_1 = require("../../user/entity/user-auth-histories.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let LogRepository = class LogRepository {
    userAuthHistoriesRepository;
    constructor(userAuthHistoriesRepository) {
        this.userAuthHistoriesRepository = userAuthHistoriesRepository;
    }
    async findLoginConnect(page, size, userType, q, orderColumn, orderSort) {
        const queryBuilder = this.userAuthHistoriesRepository.createQueryBuilder('h')
            .leftJoin('users', 'u', 'h.user_id = u.id')
            .leftJoin('user_social_accounts', 's', 's.user_id = u.id')
            .select([
            'h.id AS id',
            'h.action AS action',
            'h.user_agent AS "userAgent"',
            'h.created_at AS "createdAt"',
            'u.identity AS identity',
            's.provider_user_id AS "providerUserId"',
            'u.name AS name',
            'u.user_type AS "userType"',
            'h.is_success AS "isSuccess"',
            'h.fail_reason AS "failReason"',
            'h.ip_address AS "ipAddress"'
        ])
            .where('u.user_type <> :userType', { userType: 'ADMIN' });
        if (userType) {
            queryBuilder.andWhere('u.user_type = :type', { type: userType });
        }
        if (q) {
            queryBuilder.andWhere(`(
                    u.identity LIKE :q
                    OR s.provider_user_id LIKE :q
                    OR u.name LIKE :q
                )`, { q: `%${q}%` });
        }
        const sortMap = {
            identity: 'u.identity',
            name: 'u.name',
            ipAddress: 'h.ip_address',
            userAgent: 'h.user_agent',
            createdAt: 'h.created_at'
        };
        if (orderColumn && orderSort && sortMap[orderColumn]) {
            queryBuilder.orderBy(sortMap[orderColumn], orderSort);
        }
        else {
            queryBuilder.orderBy('h.created_at', 'DESC');
        }
        queryBuilder.offset(page) // skip 대신 offset (Raw 쿼리 지향 시)
            .limit(size);
        const list = await queryBuilder.getRawMany();
        const total = await queryBuilder.getCount();
        //const [data, total] = await queryBuilder.getManyAndCount();
        return {
            list,
            total,
            currentPage: page,
            limit: size,
        };
    }
};
exports.LogRepository = LogRepository;
exports.LogRepository = LogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_auth_histories_entity_1.UserAuthHistories)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LogRepository);
//# sourceMappingURL=log.repository.js.map