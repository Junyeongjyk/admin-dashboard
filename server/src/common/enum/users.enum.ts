export enum SignupType {
  USER = 'USER', //일반 회원
  PARTNER = 'PARTNER', //파트너
}

export enum UserType {
  USER = 'USER', //일반 회원
  PARTNER = 'PARTNER', //탐정
  ADMIN = 'ADMIN', //관리자
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',       // 활성
  INACTIVE = 'INACTIVE',   // 비활성
  SUSPENDED = 'SUSPENDED', // 정지
  WITHDRAWN = 'WITHDRAWN', // 탈퇴
}

export enum LoginAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAIL = 'LOGIN_FAIL',
}


export enum SignupPath {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}
