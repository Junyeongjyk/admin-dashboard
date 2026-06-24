import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { handleSend, log } from "../config/log.tools.config";
import { NoticesListRequestDto } from "./dto/notices-list.dto";
import { NoticesRepository } from "./notices.repository";
import { NoticesItem } from "./dto/data/notices-list-data.dto";

@Injectable()
export class NoticesService {

    constructor(
        private readonly noticesRepository: NoticesRepository,
    ) {}

    async getList(dto: NoticesListRequestDto, token:any) {
        try {
            const items:NoticesItem[] = await this.noticesRepository.findNoticesList(token.type)
            return handleSend({items})
            
        } catch (error) {
            log('[NoticesService] getList',  '공지사항 목록 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('공지사항 목록 오류가 발생했습니다.')
        }
    }


    async getDetail(noticeId: number, token:any) {
        try {

            const info = await this.noticesRepository.findById(noticeId)

            if (!info) {
                throw new NotFoundException('공지사항 존재하지 않습니다.')
            }

            return handleSend(info)

        } catch (error) {
            log('[NoticesService] getList',  '공지사항 상세 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('공지사항 상세 오류가 발생했습니다.')
        }
    }
}