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
exports.CommunityRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const community_posts_entity_1 = require("../../community/entity/community-posts.entity");
const community_comments_entity_1 = require("../../community/entity/community-comments.entity");
let CommunityRepository = class CommunityRepository {
    communityPostRepository;
    communityCommentRepository;
    constructor(communityPostRepository, communityCommentRepository) {
        this.communityPostRepository = communityPostRepository;
        this.communityCommentRepository = communityCommentRepository;
    }
    async saveCommunityPost(communityPost) {
        return await this.communityPostRepository.save(communityPost);
    }
    async saveCommunityComment(communityComment) {
        return await this.communityCommentRepository.save(communityComment);
    }
    async getList(dto) {
        // const { page, size, category } = dto;
        const page = dto.page ?? 1;
        const size = dto.size ?? 10;
        const category = dto.category ?? 'ALL';
        const type = dto.type;
        const queryBuilder = this.communityPostRepository
            .createQueryBuilder('comPost')
            .leftJoinAndSelect('comPost.author', 'users')
            .where('comPost.is_deleted IS NOT TRUE')
            .orderBy('comPost.id', 'DESC')
            .skip((page - 1) * size)
            .take(size)
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(cc.id)')
                .from('community_comments', 'cc')
                .where('cc.post_id = comPost.id')
                .andWhere('cc.is_deleted IS NOT TRUE');
        }, 'commentCount');
        if (category !== 'ALL') {
            queryBuilder.andWhere('comPost.category = :category', { category });
        }
        if (type) {
            queryBuilder.andWhere('comPost.type = :type', { type });
        }
        const { raw, entities } = await queryBuilder.getRawAndEntities();
        const data = entities.map((entity, index) => ({
            ...entity,
            commentCount: Number(raw[index].commentCount) || 0,
        }));
        const total = await queryBuilder.getCount();
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }
    async updateViewCount(id) {
        await this.communityPostRepository.increment({ id }, 'viewCount', 1);
    }
    async findById(id) {
        return this.communityPostRepository.createQueryBuilder('c')
            .innerJoin('c.author', 'u')
            .select([
            'c.id AS id',
            'c.title AS title',
            'c.like_count AS "likeCount"',
            'c.view_count AS "viewCount"',
            'u.id AS "authorId"',
            'u.name AS "authorName"',
            `TO_CHAR(c.created_at, 'YYYY-MM-DD') AS "createdAt"`,
            'c.category AS category',
            'c.type AS type',
            'c.content AS content',
        ])
            .addSelect((subQ) => {
            return subQ
                .select(`
                    COALESCE(
                    json_agg(
                        json_build_object(
                        'id', cc.id,
                        'postId', cc.post_id,
                        'parentId', cc.parent_id,
                        'content', cc.content,
                        'authorId', cu.id,
                        'authorName', cu.name,
                        'createdAt', TO_CHAR(cc.created_at, 'YYYY-MM-DD HH24:MI:SS')
                        )
                        ORDER BY cc.created_at ASC
                    ) FILTER (WHERE cc.id IS NOT NULL),
                    '[]'::json
                    )
                `)
                .from('community_comments', 'cc')
                .leftJoin('users', 'cu', 'cu.id = cc.author_id')
                .where('cc.post_id = c.id')
                .andWhere('cc.is_deleted IS NOT TRUE');
        }, 'comments')
            .where('c.is_hidden IS NOT TRUE')
            .andWhere('c.is_deleted IS NOT TRUE')
            .andWhere('c.id = :id', { id })
            .getRawOne();
    }
    async findByIdComment(id) {
        return await this.communityCommentRepository.createQueryBuilder('comment')
            .where('comment.id = :id', { id })
            .getOne();
    }
    async findByIdPost(id) {
        return await this.communityPostRepository.createQueryBuilder('c')
            .where('c.id = :id', { id })
            .getOne();
    }
};
exports.CommunityRepository = CommunityRepository;
exports.CommunityRepository = CommunityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(community_posts_entity_1.CommunityPost)),
    __param(1, (0, typeorm_1.InjectRepository)(community_comments_entity_1.CommunityComment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommunityRepository);
//# sourceMappingURL=community.repository.js.map