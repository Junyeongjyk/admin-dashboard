import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notices } from "./entity/notices.entity";
import { Repository } from "typeorm";
import { NoticesItem } from "./dto/data/notices-list-data.dto";
import { NoticesUserDetailResponseDto } from "./dto/data/notices-detail-data.dto";

@Injectable()
export class NoticesRepository {

    constructor(
        @InjectRepository(Notices)
        private readonly noticesRepository: Repository<Notices>,
    ) {}

    async findNoticesList(userType: string): Promise<NoticesItem[]> {

        const PRIORITY_ORDER = `
            CASE notices.priority
                WHEN 'URGENT' THEN 1
                WHEN 'IMPORTANT' THEN 2
                WHEN 'NORMAL' THEN 3
                ELSE 4
            END
        `;

        return await this.noticesRepository.createQueryBuilder('notices')
            .select([
                'notices.id AS id',
                'notices.category AS category',
                'notices.priority AS priority',
                'notices.title AS title',
                `TO_CHAR(notices.reserved_at, 'YYYY-MM-DD') AS "reservedAt"`,
                `TO_CHAR(notices.created_at, 'YYYY-MM-DD') AS "createdAt"`,
            ])
            .where('notices.is_published = true')
            .andWhere('notices.target_user_type = :userType', {userType:"ALL"})  
            // 예약 게시: reserved_at이 없거나 지금 이전
            .andWhere('(notices.reserved_at IS NULL OR notices.reserved_at <= NOW())')
            // 만료: expired_at이 없거나 지금 이후
            .andWhere('(notices.expired_at IS NULL OR notices.expired_at > NOW())')
            .orderBy('notices.is_pinned', 'DESC')
            .addOrderBy(PRIORITY_ORDER, 'ASC')
            .addOrderBy('notices.created_at', 'DESC')
            .getRawMany()
    }

    async findById(id:number): Promise<NoticesUserDetailResponseDto | null | undefined> {

        await this.noticesRepository.increment({ id }, 'viewCount', 1);
        return await this.noticesRepository.createQueryBuilder('notices')
            .select([
                'notices.id AS id',
                'notices.category AS category',
                'notices.priority AS priority',
                'notices.title AS title',
                'notices.content AS content',
                `TO_CHAR(notices.reserved_at, 'YYYY-MM-DD') AS "reservedAt"`,
                `TO_CHAR(notices.created_at, 'YYYY-MM-DD') AS "createdAt"`,
            ])
            .where('notices.id = :id', {id})
            .getRawOne()
    }
    
}