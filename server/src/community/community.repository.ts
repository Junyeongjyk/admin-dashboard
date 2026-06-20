import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityPost } from "./entity/community-posts.entity";
import { Repository } from "typeorm";
import { CommunityClientListItem, EventBannerItem } from "./dto/data/community-list-data.dto";
import { SearchType } from "../common/enum/community.eum";
import { CommunityComment } from "./entity/community-comments.entity";
import { Banner } from "../admin/system/entity/banner.entity";

@Injectable()
export class CommunityRepository {

    constructor(
        @InjectRepository(CommunityPost)
        private readonly communityPostRepository: Repository<CommunityPost>,
        @InjectRepository(CommunityComment)
        private readonly communityCommentRepository: Repository<CommunityComment>,
        @InjectRepository(Banner)
        private readonly banneerRepository: Repository<Banner>,
    ) {}

    
    async saveCommunityPost(communityPost: CommunityPost): Promise<CommunityPost> {
        return await this.communityPostRepository.save(communityPost);
    }

    async saveCommunityComment(communityComment: CommunityComment): Promise<CommunityComment> {
        return await this.communityCommentRepository.save(communityComment)
    }

    async findByFilterList(type:string, filter:string|undefined, keyword:string|undefined): Promise<CommunityClientListItem[]> {
        const queryBuilde = this.communityPostRepository.createQueryBuilder('c')
            .innerJoin('c.author', 'u')
            .select([
                'c.id AS id',
                'c.title AS title',
                'c.category AS category',  
                'c.like_count AS "likeCount"',
                'c.view_count AS "viewCount"', 
                'u.id AS "authorId"', 
                'u.name AS "authorName"', 
                `TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"`,
            ])

            .addSelect((subQ) => { // 댓글수 추가
                return subQ
                    .select('COUNT(*)')
                    .from('community_comments', 'cc')
                    .where('cc.post_id = c.id')
                    .andWhere('cc.is_deleted IS NOT TRUE');
            }, 'commentCount')

            .where('c.isHidden IS NOT TRUE')
            .andWhere('c.isDeleted IS NOT TRUE')
            .andWhere('c.type = :type', { type })

            if (filter && keyword) {

                switch (filter) {
                    case SearchType.TITLE:
                        queryBuilde.andWhere('c.title ILIKE :keyword', {keyword: `%${keyword}%`})
                        break;
                    case SearchType.AUTHOR:
                        queryBuilde.andWhere('u.name ILIKE :keyword', {keyword: `%${keyword}%`})
                        break;
                    case SearchType.CONTENT:
                        queryBuilde.andWhere('c.content ILIKE :keyword', {keyword: `%${keyword}%`})
                        break;
                }

            }


        return queryBuilde.orderBy('c.createdAt', 'ASC')
                .getRawMany();
    }

    async updateViewCount(id: number): Promise<void> {
        await this.communityPostRepository.increment({ id }, 'viewCount', 1);
    }

    async findById(id: number): Promise<CommunityClientListItem | undefined> {
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

    async findByBanner(target:string): Promise<EventBannerItem[]> {
        return await this.banneerRepository.createQueryBuilder('b')
            .select([
                'b.position AS "position"',
                'b.title AS "title"',
                'b.content AS "content"',
                'b.button_title AS "buttonTitle"',
                'b.link AS "link"'
            ])
            .where('b.is_enabled = :enabled', {enabled: true})
            .andWhere('b.display_target = :target', { target })
            .orderBy('b.position', 'DESC')
            .getRawMany()
    }
}