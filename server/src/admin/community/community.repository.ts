import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommunityListItem } from "./dto/data/community-list-data.dto";
import { CommunityPostType, SearchType } from "../../common/enum/community.eum";
import { CommunityPost } from "../../community/entity/community-posts.entity";
import { CommunityComment } from "../../community/entity/community-comments.entity";
import { CommunityListRequestDto } from "./dto/community-list.dto";
import { CommunityDeleteRequestDto } from "./dto/community-delete.dto";

@Injectable()
export class CommunityRepository {
   constructor(
        @InjectRepository(CommunityPost)
        private readonly communityPostRepository: Repository<CommunityPost>,
        @InjectRepository(CommunityComment)
        private readonly communityCommentRepository: Repository<CommunityComment>,
    ) {}

    async saveCommunityPost(communityPost: CommunityPost): Promise<CommunityPost> {
        return await this.communityPostRepository.save(communityPost);
    }

    async saveCommunityComment(communityComment: CommunityComment): Promise<CommunityComment> {
        return await this.communityCommentRepository.save(communityComment)
    }

    async getList(dto: CommunityListRequestDto): Promise<any> {
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

    async updateViewCount(id: number): Promise<void> {
        await this.communityPostRepository.increment({ id }, 'viewCount', 1);
    }

    async findById(id: number): Promise<CommunityListItem | undefined> {
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

    async findByIdComment(id:number): Promise<CommunityComment| null> {
        return await this.communityCommentRepository.createQueryBuilder('comment')
                    .where('comment.id = :id', {id})
                    .getOne();
    }

    async findByIdPost(id:number): Promise<CommunityPost | null> {
        return await this.communityPostRepository.createQueryBuilder('c')
                        .where('c.id = :id', {id})
                        .getOne();
    }
    
}
