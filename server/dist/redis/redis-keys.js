"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTTL = exports.RedisKeys = void 0;
exports.RedisKeys = {
    verify: {
        phone: {
            issue: (phone) => `verify:phone:${phone}`, //휴대폰 인증번호 관련 정보
            verified: (phone) => `verify:confirm:phone:${phone}`, //휴대폰 인증완료 관련 정보
        },
        email: {
            issue: (email, id) => `verify:email:${id}:${email}`, //이메일 인증번호 관련 정보
            verified: (email, id) => `verify:confirm:email:${id}:${email}`, //이메일  인증완료 관련 정보
        }
    }
};
exports.RedisTTL = {
    RESEND_COOLDOWN_SECONDS: 60, // 1분 후 인증코드 재요청가능
    VERIFY_CODE: 3 * 60, // 3분 인증코드 유효시간 
    VERIFY_VERIFIED: 30 * 60, // 30분 인증완료 유효시간
    VERIFY_COOLDOWN: 60, // 60초
    AUTH_REFRESH_TOKEN: 30 * 24 * 60 * 60, // 30일
    PASSWORD_RESET: 10 * 60, // 10분
};
//# sourceMappingURL=redis-keys.js.map