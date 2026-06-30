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
exports.UserAuthHistories = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const users_enum_1 = require("../../common/enum/users.enum");
let UserAuthHistories = class UserAuthHistories {
    id;
    userId;
    user;
    action;
    ipAddress;
    userAgent;
    uuid;
    isSuccess;
    failReason;
    createdAt;
};
exports.UserAuthHistories = UserAuthHistories;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAuthHistories.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], UserAuthHistories.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], UserAuthHistories.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: users_enum_1.LoginAction,
        comment: 'LOGIN | LOGOUT',
    }),
    __metadata("design:type", String)
], UserAuthHistories.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ip_address',
        type: 'varchar',
        length: 45,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserAuthHistories.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_agent',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserAuthHistories.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'uuid',
        type: 'varchar',
        nullable: true,
        comment: '모바일 앱 디바이스 UUID',
    }),
    __metadata("design:type", Object)
], UserAuthHistories.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_success',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], UserAuthHistories.prototype, "isSuccess", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fail_reason',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserAuthHistories.prototype, "failReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], UserAuthHistories.prototype, "createdAt", void 0);
exports.UserAuthHistories = UserAuthHistories = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_auth_histories' })
], UserAuthHistories);
//# sourceMappingURL=user-auth-histories.entity.js.map