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
exports.PartnerProfiles = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../user/entity/users.entity");
let PartnerProfiles = class PartnerProfiles {
    id;
    /**
     * users.id (1:1)
     */
    userId;
    user;
    nickname;
    createdAt;
    updatedAt;
    profilePath;
};
exports.PartnerProfiles = PartnerProfiles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PartnerProfiles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'user_id' }),
    __metadata("design:type", Number)
], PartnerProfiles.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], PartnerProfiles.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PartnerProfiles.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], PartnerProfiles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], PartnerProfiles.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'profile_path',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PartnerProfiles.prototype, "profilePath", void 0);
exports.PartnerProfiles = PartnerProfiles = __decorate([
    (0, typeorm_1.Entity)({ name: 'partner_profiles' })
], PartnerProfiles);
//# sourceMappingURL=partner-profiles.entity.js.map