import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "../../user/entity/users.entity";
import { Notices } from "../../notices/entity/notices.entity";

@Injectable()
export class NoticesRepository {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Notices)
        private readonly noticesRepository: Repository<Notices>,

    ) {}
    async getList(dto: any,): Promise<any> {
        const { page, size, category} = dto;

        const queryBuilder = this.noticesRepository.createQueryBuilder('notices')
            .skip(page)
            .take(size);

        const [data, total] = await queryBuilder.getManyAndCount();
        // console.log(data)
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }
    async noticesDelete(dto: any): Promise<any> {
        const { noticeId } = dto;
        const result = await this.noticesRepository.delete({
            id: noticeId,
        });
        return result

    }
    async noticesCreate(dto: any, token:any): Promise<any> {
      
        const notice = this.noticesRepository.create({
            category: dto.category,
            targetUserType: dto.target,   // DTO target → entity targetUserType
            priority: dto.priority,
            title: dto.title,
            content: dto.content,

            // 게시 여부 (예약 있으면 false)
            isPublished: dto.publishedAt ? false : true,

            // 예약 게시 시각
            reservedAt: dto.publishedAt ?? null,
            createdBy:token.name,
        });

        return await this.noticesRepository.save(notice);
    }
}