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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notices = void 0;
const typeorm_1 = require("typeorm");
const notices_enum_1 = require("../../common/enum/notices.enum");
let Notices = class Notices {
    id;
    category;
    targetUserType;
    priority;
    title;
    content;
    isPublished;
    isPinned;
    viewCount;
    createdBy;
    createdAt;
    updatedAt;
};
exports.Notices = Notices;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notices.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        comment: '공지 카테고리',
    }),
    __metadata("design:type", String)
], Notices.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'target_user_type',
        type: 'varchar',
        comment: '대상 사용자 유형',
    }),
    __metadata("design:type", String)
], Notices.prototype, "targetUserType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: notices_enum_1.NoticePriority,
        comment: '공지 중요도 (NORMAL | IMPORTANT | URGENT)',
        default: notices_enum_1.NoticePriority.NORMAL
    }),
    __metadata("design:type", String)
], Notices.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        comment: '공지 제목',
    }),
    __metadata("design:type", String)
], Notices.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        comment: '공지 내용',
    }),
    __metadata("design:type", String)
], Notices.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_published',
        type: 'boolean',
        default: false,
        comment: '게시 여부',
    }),
    __metadata("design:type", Boolean)
], Notices.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_pinned',
        type: 'boolean',
        default: false,
        comment: '상단 고정 여부',
    }),
    __metadata("design:type", Boolean)
], Notices.prototype, "isPinned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'view_count',
        type: 'int',
        default: 0,
        comment: '조회수',
    }),
    __metadata("design:type", Number)
], Notices.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'varchar',
        nullable: true,
        comment: '작성 관리자',
    }),
    __metadata("design:type", String)
], Notices.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Notices.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Notices.prototype, "updatedAt", void 0);
exports.Notices = Notices = __decorate([
    (0, typeorm_1.Entity)({ name: 'notices' })
], Notices);
//# sourceMappingURL=notices.entity.js.map