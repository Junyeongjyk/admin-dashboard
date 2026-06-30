"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const common_1 = require("@nestjs/common");
const aes_util_1 = require("../common/functions/aes.util");
const common_2 = require("../common/functions/common");
let AuthenticationMiddleware = class AuthenticationMiddleware {
    timeOut = 100000;
    constructor() { }
    use(req, res, next) {
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
                throw new common_1.ForbiddenException('허용되지 않은 요청입니다.');
            }
            const decrypt = JSON.parse((0, aes_util_1.getDecryptData)(bearer, '토큰'));
            const timestamp = (0, common_2.dateFormatFotKorea)(decrypt.timestamp);
            const now = (0, common_2.dateFormatFotKorea)(new Date().toISOString());
            const timeDifference = Math.abs(now.getTime() - timestamp.getTime());
            if (timeDifference > this.timeOut) {
                console.error(`[TIMEOUT] Request Timestamp: ${timestamp}, Server Time: ${now}, Difference: ${timeDifference}`);
                throw new common_1.BadRequestException('요청시간이 초과했습니다. 다시 시도해주세요.');
            }
            if (decrypt.uri !== req.baseUrl)
                throw new common_1.BadRequestException('허용되지 않는 경로입니다.');
            return next();
        }
        catch (error) {
            console.error(`[ERROR] TITLE: AuthenticationMiddleware | MESSAGE: ${error.message} | PATH: ${req.baseUrl}`);
            return res.status(common_1.HttpStatus.FORBIDDEN).json({
                status: -4,
                timestamp: new Date().toISOString(),
                message: error.message,
            });
        }
    }
    excludedUrls(url) {
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
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
exports.AuthenticationMiddleware = AuthenticationMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthenticationMiddleware);
//# sourceMappingURL=authentication.middleware.js.map