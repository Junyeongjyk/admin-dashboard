import { Injectable } from "@nestjs/common";
import { User } from "../../user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserListRequestDto } from "../user/dto/users-list.dto";
import { PartnerProfiles } from "../../partner/entity/partner-profiles.entity";

@Injectable()
export class PartnerRepository {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(PartnerProfiles)
        private readonly partnerProfiles: Repository<PartnerProfiles>,
    ) {}

    async getList(dto: UserListRequestDto): Promise<any> {
        const { page = 0, size = 20, q, orderColumn, orderSort } = dto;

        const queryBuilder = this.usersRepository.createQueryBuilder('u')
            .leftJoinAndSelect('u.partnerProfile', 'partnerProfile')
            .leftJoinAndSelect('partnerProfile.certifications', 'certifications')
            .where('u.userType = :userType', { userType: 'PARTNER' })
            .skip(page)
            .take(size);

        if (orderColumn && orderSort) {
            queryBuilder.orderBy(orderColumn, orderSort as 'ASC' | 'DESC');
        } else {
            queryBuilder.orderBy('u.createdAt', 'DESC');
        }

        const [data, total] = await queryBuilder.getManyAndCount();
        // console.log(data)
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }

}