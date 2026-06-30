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
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../../user/entity/users.entity");
const notices_entity_1 = require("../../notices/entity/notices.entity");
let NoticesRepository = class NoticesRepository {
    usersRepository;
    noticesRepository;
    constructor(usersRepository, noticesRepository) {
        this.usersRepository = usersRepository;
        this.noticesRepository = noticesRepository;
    }
    async getList(dto) {
        const { page, size, category } = dto;
        const queryBuilder = this.noticesRepository.createQueryBuilder('notices')
            .skip(page)
            .take(size);
        const [data, total] = await queryBuilder.getManyAndCount();
        // console.log(data)
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }
    async noticesDelete(dto) {
        const { noticeId } = dto;
        const result = await this.noticesRepository.delete({
            id: noticeId,
        });
        return result;
    }
    async noticesCreate(dto, token) {
        const notice = this.noticesRepository.create({
            category: dto.category,
            targetUserType: dto.target, // DTO target → entity targetUserType
            priority: dto.priority,
            title: dto.title,
            content: dto.content,
            // 게시 여부 (예약 있으면 false)
            isPublished: dto.publishedAt ? false : true,
            // 예약 게시 시각
            reservedAt: dto.publishedAt ?? null,
            createdBy: token.name,
        });
        return await this.noticesRepository.save(notice);
    }
};
exports.NoticesRepository = NoticesRepository;
exports.NoticesRepository = NoticesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(notices_entity_1.Notices)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NoticesRepository);
//# sourceMappingURL=community.repository.js.map