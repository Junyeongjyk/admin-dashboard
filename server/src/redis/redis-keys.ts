export const RedisKeys = {
    verify: {
        phone: {
            issue: (phone: string) => `verify:phone:${phone}`, //휴대폰 인증번호 관련 정보
            verified: (phone: string) => `verify:confirm:phone:${phone}`, //휴대폰 인증완료 관련 정보
        },
        email: {
            issue: (email: string, id:number) => `verify:email:${id}:${email}`, //이메일 인증번호 관련 정보
            verified: (email: string, id:number) => `verify:confirm:email:${id}:${email}`, //이메일  인증완료 관련 정보
        }
    }
}


export const RedisTTL = {
    RESEND_COOLDOWN_SECONDS: 60, // 1분 후 인증코드 재요청가능
    VERIFY_CODE: 3 * 60,          // 3분 인증코드 유효시간 
    VERIFY_VERIFIED: 30 * 60,       // 30분 인증완료 유효시간
    VERIFY_COOLDOWN: 60,                // 60초
    AUTH_REFRESH_TOKEN: 30 * 24 * 60 * 60,    // 30일
    PASSWORD_RESET: 10 * 60,                  // 10분
} as const;