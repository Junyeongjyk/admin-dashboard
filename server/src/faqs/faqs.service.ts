import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FaqsListRequestDto } from "./dto/faqs-list.dto";
import { handleSend, log } from "../config/log.tools.config";
import { FaqsRepository } from "./faqs.repository";

@Injectable()
export class FaqsService {

    constructor(
        private readonly faqsRepository: FaqsRepository,
    ) {}

    async getList(dto: FaqsListRequestDto) {
        try {

            const items = await this.faqsRepository.findFaqsList()
            return handleSend({items})
            
        } catch (error) {
            log('[FaqsService] getList',  'FAQ 목록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('FAQ 목록 오류가 발생했습니다.')
        }
    }

}