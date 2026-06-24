import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { handleSend, log } from "../../config/log.tools.config";
import { NoticesDeleteRequestDto } from "./dto/notices-delete.dto";
import { NoticesListRequestDto } from "./dto/notices-list.dto";
import { NoticesCreateRequestDto } from "./dto/notices-create.dto";
import { NoticesRepository } from "./notices.repository";

@Injectable()
export class NoticesService {
    constructor(
        private readonly noticesRepository: NoticesRepository,
    ) {}
    async getList(dto: NoticesListRequestDto) {
        try {
        
            const result = await this.noticesRepository.getList(dto)
            return handleSend(result)
            
        } catch (error) {
            log('[NoticesService] getList',  '관리자 - 공지사항 목록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 공지사항 목록 오류가 발생했습니다.')
        }
    }


    // async getDetail(noticeId: number) {
    //     try {

    //         /**
    //          * TODO 공지사항 상세조회
    //          * 1. 유효한 공지인지 데이터 검사
    //          */

    //         const sample = {
    //             id: 1, 
    //             title: '이용 수칙',
    //             content: '1. 이용수칙.........',
    //             attachments: [
    //                 {url: 'https://도메인/api/filedownload', fileName: 'event.png'}
    //             ]
    //         }

    //         return handleSend(sample)

    //     } catch (error) {
    //         log('[NoticesService] getList',  '공지사항 상세 오류가 발생했습니다.', error)
    
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
            
    //         throw new InternalServerErrorException('공지사항상세 오류가 발생했습니다.')
    //     }
    // }

    async noticesDelete(dto: NoticesDeleteRequestDto) {
        try {
            const result = await this.noticesRepository.noticesDelete(dto)
            return handleSend(result)

        } catch (error) {
            log('[NoticesService] noticesDelete',  '공지사항 삭제 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('공지사항 삭제 오류가 발생했습니다.')
        }
    }

    async noticesCreate(dto: NoticesCreateRequestDto, token:any) {
        try {

            const result = await this.noticesRepository.noticesCreate(dto, token)
            return handleSend(result)

        } catch (error) {
            log('[NoticesService] noticesCreate',  '관리자 - 공지사항 등록중 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('공지사항 등록 오류가 발생했습니다.')
        }
    }
}