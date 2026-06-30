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
exports.CommunityComment = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../../../user/entity/users.entity");
const community_posts_entity_1 = require("./community-posts.entity");
let CommunityComment = class CommunityComment {
    id;
    /* ===============================
    * FK 컬럼들
    * =============================== */
    // post_id (BIGINT)
    postId;
    // author_id (BIGINT)
    authorId;
    // parent_id (BIGINT, nullable)
    parentId;
    /* ===============================
    * 데이터 컬럼
    * =============================== */
    content;
    isDeleted;
    /* ===============================
    * 타임스탬프
    * =============================== */
    createdAt;
    updatedAt;
    /* ===============================
    * 관계 설정
    * =============================== */
    // 작성자
    author;
    // 게시글
    post;
    // 부모 댓글 (대댓글)
    parent;
    // 자식 댓글들
    children;
};
exports.CommunityComment = CommunityComment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], CommunityComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id', type: 'bigint' }),
    __metadata("design:type", Number)
], CommunityComment.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'bigint' }),
    __metadata("design:type", Number)
], CommunityComment.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], CommunityComment.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text' }),
    __metadata("design:type", String)
], CommunityComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        nullable: true,
        default: () => 'false',
    }),
    __metadata("design:type", Object)
], CommunityComment.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Object)
], CommunityComment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Object)
], CommunityComment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id', referencedColumnName: 'id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], CommunityComment.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => community_posts_entity_1.CommunityPost, (post) => post.comments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id', referencedColumnName: 'id' }),
    __metadata("design:type", community_posts_entity_1.CommunityPost)
], CommunityComment.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CommunityComment, (comment) => comment.children, {
        onDelete: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id', referencedColumnName: 'id' }),
    __metadata("design:type", Object)
], CommunityComment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CommunityComment, (comment) => comment.parent),
    __metadata("design:type", Array)
], CommunityComment.prototype, "children", void 0);
exports.CommunityComment = CommunityComment = __decorate([
    (0, typeorm_1.Entity)({ name: 'community_comments' })
], CommunityComment);
//# sourceMappingURL=community-comments.entity.js.map