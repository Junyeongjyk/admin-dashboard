export enum ApiPath{
    LOGIN = '/api/v1/auth/login', // 일반 로그인
    LOGOUT = '/api/v1/auth/logout', // 로그아웃
    CHECK_IDENTITY = '/api/v1/auth/check-identity', // 아이디 중복 검사
    SIGNUP = '/api/v1/auth/signup', // 일반 회원가입
}
