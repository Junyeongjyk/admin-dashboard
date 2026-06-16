import { Injectable } from "@nestjs/common";
import { UserAuthHistories } from "../../user/entity/user-auth-histories.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class LogRepository {
    constructor(
        @InjectRepository(UserAuthHistories)
        private readonly userAuthHistoriesRepository: Repository<UserAuthHistories>,
    ) {}
    
    async findLoginConnect(
        page:number,
        size:number,
        userType?:string,
        q?:string,
        orderColumn?:string,
        orderSort?:'ASC' | 'DESC' ) {

        const queryBuilder = this.userAuthHistoriesRepository.createQueryBuilder('h')
                                .leftJoin('users', 'u', 'h.user_id = u.id')
                                .leftJoin('user_social_accounts', 's', 's.user_id = u.id')
                                .select([
                                    'h.id AS id',
                                    'h.action AS action',
                                    'h.user_agent AS "userAgent"',
                                    'h.created_at AS "createdAt"',
                                    'u.identity AS identity',
                                    's.provider_user_id AS "providerUserId"',
                                    'u.name AS name',
                                    'u.user_type AS "userType"',
                                    'h.is_success AS "isSuccess"',
                                    'h.fail_reason AS "failReason"',
                                    'h.ip_address AS "ipAddress"'
                                ])
                                .where('u.user_type <> :userType', { userType: 'ADMIN' })                                

        if (userType) {
            queryBuilder.andWhere('u.user_type = :type', {type: userType})
        }

        if (q) {
            queryBuilder.andWhere(
                `(
                    u.identity LIKE :q
                    OR s.provider_user_id LIKE :q
                    OR u.name LIKE :q
                )`,
                { q: `%${q}%` },
            );
        }

        const sortMap = {
            identity: 'u.identity',
            name: 'u.name',
            ipAddress: 'h.ip_address',
            userAgent: 'h.user_agent',
            createdAt: 'h.created_at'
        };

        if (orderColumn && orderSort && sortMap[orderColumn]) {
            queryBuilder.orderBy(sortMap[orderColumn], orderSort);
        } else {
            queryBuilder.orderBy('h.created_at', 'DESC');
        }

        queryBuilder.offset(page) // skip 대신 offset (Raw 쿼리 지향 시)
                    .limit(size);

        const list = await queryBuilder.getRawMany();
        const total = await queryBuilder.getCount();
        //const [data, total] = await queryBuilder.getManyAndCount();

        return {
            list,
            total,
            currentPage: page,
            limit: size,
        };
    }
}