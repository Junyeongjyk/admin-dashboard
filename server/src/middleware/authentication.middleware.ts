import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { getDecryptData } from "../common/functions/aes.util";
import { dateFormatFotKorea } from "../common/functions/common";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    private timeOut = 100000;

    constructor() {}

    use(req: any, res: any, next: (error?: any) => void) {
        try {
            const path = req.originalUrl ?? req.baseUrl;
            if (this.excludedUrls(path)) {
                return next();
            }

            const authHeader = req.headers?.['authorization'];
            let bearer = '';
            if (authHeader && authHeader.startsWith('Bearer ')) {
                bearer = authHeader.split(' ')[1];
            }

            // 여기부터는 제외 경로가 아닐 때만 실행됨
            if (!bearer) {
                throw new ForbiddenException('허용되지 않은 요청입니다.');
            }

            const decrypt: { uri: string, timestamp: string } = JSON.parse(getDecryptData(bearer, '토큰'));
            const timestamp = dateFormatFotKorea(decrypt.timestamp);
            const now = dateFormatFotKorea(new Date().toISOString());
            const timeDifference = Math.abs(now.getTime() - timestamp.getTime());   

            if(timeDifference > this.timeOut) {
                console.error(`[TIMEOUT] Request Timestamp: ${timestamp}, Server Time: ${now}, Difference: ${timeDifference}`);
                throw new BadRequestException('요청시간이 초과했습니다. 다시 시도해주세요.');
            }
        
            if(decrypt.uri !== req.baseUrl) throw new BadRequestException('허용되지 않는 경로입니다.');

            return next();

        } catch (error: any) {
            console.error(
                `[ERROR] TITLE: AuthenticationMiddleware | MESSAGE: ${error.message} | PATH: ${req.baseUrl}`,
            );

            return res.status(HttpStatus.FORBIDDEN).json({
                status: -4,
                timestamp: new Date().toISOString(),
                message: error.message,
            });
        }
    }

    private excludedUrls(url: string): boolean {
        const excluded = [
            '/api/v1/auth', 
            '/api/v1/clientIp',
            '/api/v1/serverTime',
            '/api/v1/request-categories',
            '/api/v1/region',
            '/api/v1/community/posts/main/view/',
            '/api/v1/option',
            '/api/v1/ban/words',
            '/api/v1/chat/image-view/',
            '/api/v1/chat/download/',
        ];

        return excluded.some((prefix) => url.startsWith(prefix));
    }

}