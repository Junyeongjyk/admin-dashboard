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
exports.NoticesRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notices_entity_1 = require("./entity/notices.entity");
const typeorm_2 = require("typeorm");
let NoticesRepository = class NoticesRepository {
    noticesRepository;
    constructor(noticesRepository) {
        this.noticesRepository = noticesRepository;
    }
    async findNoticesList(userType) {
        const PRIORITY_ORDER = `
            CASE notices.priority
                WHEN 'URGENT' THEN 1
                WHEN 'IMPORTANT' THEN 2
                WHEN 'NORMAL' THEN 3
                ELSE 4
            END
        `;
        return await this.noticesRepository.createQueryBuilder('notices')
            .select([
            'notices.id AS id',
            'notices.category AS category',
            'notices.priority AS priority',
            'notices.title AS title',
            `TO_CHAR(notices.reserved_at, 'YYYY-MM-DD') AS "reservedAt"`,
            `TO_CHAR(notices.created_at, 'YYYY-MM-DD') AS "createdAt"`,
        ])
            .where('notices.is_published = true')
            .andWhere('notices.target_user_type = :userType', { userType: "ALL" })
            // 예약 게시: reserved_at이 없거나 지금 이전
            .andWhere('(notices.reserved_at IS NULL OR notices.reserved_at <= NOW())')
            // 만료: expired_at이 없거나 지금 이후
            .andWhere('(notices.expired_at IS NULL OR notices.expired_at > NOW())')
            .orderBy('notices.is_pinned', 'DESC')
            .addOrderBy(PRIORITY_ORDER, 'ASC')
            .addOrderBy('notices.created_at', 'DESC')
            .getRawMany();
    }
    async findById(id) {
        await this.noticesRepository.increment({ id }, 'viewCount', 1);
        return await this.noticesRepository.createQueryBuilder('notices')
            .select([
            'notices.id AS id',
            'notices.category AS category',
            'notices.priority AS priority',
            'notices.title AS title',
            'notices.content AS content',
            `TO_CHAR(notices.reserved_at, 'YYYY-MM-DD') AS "reservedAt"`,
            `TO_CHAR(notices.created_at, 'YYYY-MM-DD') AS "createdAt"`,
        ])
            .where('notices.id = :id', { id })
            .getRawOne();
    }
};
exports.NoticesRepository = NoticesRepository;
exports.NoticesRepository = NoticesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notices_entity_1.Notices)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NoticesRepository);
//# sourceMappingURL=notices.repository.js.map