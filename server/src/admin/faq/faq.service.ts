import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FaqsCreateRequestDto } from "./dto/faqs-create.dto";
import { handleSend, log } from "../../config/log.tools.config";
import { FaqsUpdateRequestDto } from "./dto/faqs-update.dto";
import { FaqsDeleteRequestDto } from "./dto/faqs-delete.dto";
import { FaqsSearchRequestDto } from "./dto/faqs-search.dto";
import { FaqsRepository } from "./faqs.repository";
@Injectable()
export class FaqsService {
    constructor(
            private readonly faqsRepository: FaqsRepository,
        ) {}
    

    async createFaq(dto: FaqsCreateRequestDto, token :any) {
        try {

            const result = await this.faqsRepository.createFaq(dto, token)
            return handleSend(result)

        } catch (error) {
            log('[FaqsService] createFaq',  '관리자 - Faq 등록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('Faq 등록 오류가 발생했습니다.')
        }
    }

    // async updateFaq(dto: FaqsUpdateRequestDto) {
    //     try {
                
    //         // TODO:
    //         // - Admin 권한 체크
    //         // - faqId 존재 확인
    //         // - dto에서 전달된 필드만 부분 업데이트
    //         // - order_no 중복/재정렬 정책 필요하면 처리


    //         return handleSend({
    //             faqId: 1,
    //             updatedAt: '2025-12-31 12:00:00',
    //         })

    //     } catch (error) {
    //         log('[FaqsService] createFaq',  '관리자 - Faq 수정 오류가 발생했습니다.', error)
    
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
            
    //         throw new InternalServerErrorException('Faq 수정 오류가 발생했습니다.')
    //     }
    // }

    async deleteFaq(dto: FaqsDeleteRequestDto) {
        try {
                
            const result = await this.faqsRepository.deleteFaq(dto)
            return handleSend(result)

        } catch (error) {
            log('[FaqsService] createFaq',  '관리자 - Faq 삭제 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('Faq 삭제 오류가 발생했습니다.')
        }
    }

    async searchFaq(dto: FaqsSearchRequestDto) {
        try {
                
            const result = await this.faqsRepository.searchFaq(dto)
            return handleSend(result)

        } catch (error) {
            log('[FaqsService] createFaq',  '관리자 - Faq 리스트 조회 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('Faq 리스트 조회 오류가 발생했습니다.')
        }
    }
}