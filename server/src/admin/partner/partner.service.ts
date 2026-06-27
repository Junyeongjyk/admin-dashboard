import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { handleSend, log } from "../../config/log.tools.config";
import { UserListRequestDto } from "../user/dto/users-list.dto";
import { PartnerRepository } from "./partner.repository";

@Injectable()
export class PartnerService {
    constructor(
        private readonly partnerRepository: PartnerRepository,
    ) {}
    
    async getList(dto: UserListRequestDto) {
        try {

            const result = await this.partnerRepository.getList(dto)
            return handleSend(result, "파트너 리스트 전달 성공했습니다.")
            
        } catch (error) {
            log('[PartnerService] getList',  '관리자 - 파트너 리스트 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 파트너 리스트 오류가 발생했습니다.')
        }
    }

}