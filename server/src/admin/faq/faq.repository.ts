import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Faqs } from "../../faqs/entity/faqs.entity";
import { FaqsCreateRequestDto } from "./dto/faqs-create.dto";
import { FaqsSearchRequestDto } from "./dto/faqs-search.dto";
import { FaqsDeleteRequestDto } from "./dto/faqs-delete.dto";

@Injectable()
export class FaqsRepository {
   constructor(
        @InjectRepository(Faqs)
        private readonly faqsRepository: Repository<Faqs>,

    ) {}
    async createFaq(dto: FaqsCreateRequestDto, token:any) : Promise<any> {
        console.log(dto, token)
        const faq = this.faqsRepository.create({
            category: dto.category,
            question: dto.question,
            answer: dto.answer,
            createdBy:token.id,
            isPublished:true,

        });
        return await this.faqsRepository.save(faq);
    }
    async searchFaq(dto: FaqsSearchRequestDto) : Promise<any> {
        const { page, size, category} = dto;

        const queryBuilder = this.faqsRepository.createQueryBuilder('faqs')
            .skip(page)
            .take(size);
        if(category != 'ALL')
        {
            queryBuilder.where('faqs.category = category', {category})
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
    async deleteFaq(dto: FaqsDeleteRequestDto) : Promise<any>  {
        const { faqId } = dto;
        const result = await this.faqsRepository.delete({
            id: faqId,
        });
        return result
    }
}
