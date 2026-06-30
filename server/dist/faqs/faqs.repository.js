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
exports.FaqsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const faqs_entity_1 = require("./entity/faqs.entity");
const typeorm_2 = require("typeorm");
let FaqsRepository = class FaqsRepository {
    faqsRepository;
    constructor(faqsRepository) {
        this.faqsRepository = faqsRepository;
    }
    async findFaqsList() {
        return await this.faqsRepository.createQueryBuilder('faqs')
            .select([
            'faqs.id AS id',
            'faqs.category AS category',
            'faqs.question AS question',
            'faqs.answer AS answer',
        ])
            .where('faqs.is_published = true')
            .orderBy('faqs.display_order', 'ASC')
            .addOrderBy('faqs.created_at', 'DESC') // 선택: 동일 순서일 때 안정성
            .getRawMany();
    }
};
exports.FaqsRepository = FaqsRepository;
exports.FaqsRepository = FaqsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(faqs_entity_1.Faqs)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FaqsRepository);
//# sourceMappingURL=faqs.repository.js.map