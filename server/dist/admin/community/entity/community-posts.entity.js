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
exports.CommunityPost = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../../user/entity/users.entity");
const community_comments_entity_1 = require("./community-comments.entity");
let CommunityPost = class CommunityPost {
    id;
    type;
    title;
    content;
    authorId;
    viewCount;
    likeCount;
    isHidden;
    isDeleted;
    // DDL: DEFAULT CURRENT_TIMESTAMP (nullable true)
    // TypeORM에서 동일하게 맞추려면 CreateDateColumn/UpdateDateColumn 사용 + default 지정
    createdAt;
    updatedAt;
    mainImage;
    category;
    author;
    comments;
};
exports.CommunityPost = CommunityPost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], CommunityPost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], CommunityPost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], CommunityPost.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'int', nullable: true, default: () => '0' }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'like_count', type: 'int', nullable: true, default: () => '0' }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_hidden', type: 'boolean', nullable: true, default: () => 'false' }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "isHidden", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', nullable: true, default: () => 'false' }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'main_image', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "mainImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CommunityPost.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id', referencedColumnName: 'id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], CommunityPost.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => community_comments_entity_1.CommunityComment, (comment) => comment.post),
    __metadata("design:type", Array)
], CommunityPost.prototype, "comments", void 0);
exports.CommunityPost = CommunityPost = __decorate([
    (0, typeorm_1.Entity)({ name: 'community_posts' })
], CommunityPost);
//# sourceMappingURL=community-posts.entity.js.map