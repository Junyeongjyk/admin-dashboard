import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Faqs } from "./entity/faqs.entity";
import { Repository } from "typeorm";
import { FaqsItem } from "./dto/data/faqs-list-data.dto";

@Injectable()
export class FaqsRepository {

    constructor(
        @InjectRepository(Faqs)
        private readonly faqsRepository: Repository<Faqs>,
    ) {}
    
    async findFaqsList(): Promise<FaqsItem[]> {
        return await this.faqsRepository.createQueryBuilder('faqs')
            .select([
                'faqs.id AS id',
                'faqs.category AS category', 
                'faqs.question AS question',
                'faqs.answer AS answer',
            ])
            .where('faqs.is_published = true')
            .orderBy('faqs.display_order', 'ASC')
            .addOrderBy('faqs.created_at', 'DESC') // 선택: 동일 순서일 때 안정성
            .getRawMany();
    }

}