import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { handleSend, log } from "../../config/log.tools.config";
import { UsersListRequestDto } from "../user/dto/users-list.dto";
import { PartnersRepository } from "./partner.repository";

@Injectable()
export class PartnersService {
    constructor(
        private readonly partnerRepository: PartnersRepository,
    ) {}
    
    async getList(dto: UsersListRequestDto) {
        try {

            const result = await this.partnerRepository.getList(dto)
            return handleSend(result, "파트너 리스트 전달 성공했습니다.")
            
        } catch (error) {
            log('[PartnersService] getList',  '관리자 - 파트너 리스트 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 파트너 리스트 오류가 발생했습니다.')
        }
    }

}