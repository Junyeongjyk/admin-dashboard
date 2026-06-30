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
exports.Faqs = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../user/entity/users.entity");
let Faqs = class Faqs {
    id;
    category;
    question;
    answer;
    isPublished;
    displayOrder;
    createdBy;
    admin;
    createdAt;
    updatedAt;
};
exports.Faqs = Faqs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Faqs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'FAQ 카테고리',
    }),
    __metadata("design:type", String)
], Faqs.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        comment: '질문',
    }),
    __metadata("design:type", String)
], Faqs.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        comment: '답변',
    }),
    __metadata("design:type", String)
], Faqs.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_published',
        type: 'boolean',
        default: true,
        comment: '게시 여부',
    }),
    __metadata("design:type", Boolean)
], Faqs.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'display_order',
        type: 'int',
        default: 0,
        comment: '노출 순서',
    }),
    __metadata("design:type", Number)
], Faqs.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'bigint',
        nullable: true,
        comment: '작성 관리자 ID',
    }),
    __metadata("design:type", Object)
], Faqs.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", Object)
], Faqs.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Faqs.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Faqs.prototype, "updatedAt", void 0);
exports.Faqs = Faqs = __decorate([
    (0, typeorm_1.Entity)({ name: 'faqs' })
], Faqs);
//# sourceMappingURL=faqs.entity.js.map