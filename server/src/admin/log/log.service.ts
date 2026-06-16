import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { handleSend, log } from "../../config/log.tools.config";
import { LogUserRequestDto } from "./dto/log-user.dto";
import { LogRepository } from "./log.repository";

@Injectable()
export class LogService {

    constructor(
        private readonly logRepository: LogRepository,
    ) {}

    async getLoginLogs(dto: LogUserRequestDto) {
        try {

            const resuslt = await this.logRepository.findLoginConnect(dto.page!, dto.size!, dto.type, dto.q)
            return handleSend(resuslt)

        } catch (error) {
            log('[LogService] getLoginLogs',  '관리자 - 접속로그 조회 오류가 발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('접속로그 조회 오류가 발생했습니다.')
        }
    }

    // async getSystemLogs(dto: LogUserRequestDto) {
    //     try {
        
    //         // TODO:
    //         // - Admin 권한 체크
    //         // - type/from/to/q 조건으로 로그 조회
    //         // - 필요하면 page/size 추가(로그는 보통 페이징 필요)

    //         return handleSend()

    //     } catch (error) {
    //         log('[LogService] getDetectiveLogs',  '관리자 - 시스템로그 조회 오류가 발생했습니다.', error)
    
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
            
    //         throw new InternalServerErrorException('시스템로그 조회 오류가 발생했습니다.')
    //     }
    // }
}