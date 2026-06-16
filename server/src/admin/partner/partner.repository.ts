import { Injectable } from "@nestjs/common";
import { Users } from "../../user/entity/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersListRequestDto } from "../user/dto/users-list.dto";
import { PartnerProfiles } from "../../partner/entity/partner-profiles.entity";

@Injectable()
export class PartnersRepository {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(PartnerProfiles)
        private readonly partnerProfiles: Repository<PartnerProfiles>,
    ) {}

    async getList(dto: UsersListRequestDto): Promise<any> {
        const { page = 0, size = 20, q, orderColumn, orderSort } = dto;

        const queryBuilder = this.usersRepository.createQueryBuilder('u')
            .leftJoinAndSelect('u.partnerProfile', 'partnerProfile')
            .leftJoinAndSelect('partnerProfile.certifications', 'certifications')
            .where('u.userType = :userType', { userType: 'DETECTIVE' })
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