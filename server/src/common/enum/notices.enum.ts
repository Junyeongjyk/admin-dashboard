export enum NoticesCategory { //공지 유형
    NORMAL =  'NORMAL', // 일반
    SYSTEM = 'SYSTEM',     // 시스템
    UPDATE = 'UPDATE',     // 업데이트/기능
    EVENT = 'EVENT',       // 이벤트
    POLICY = 'POLICY',     // 정책/약관
    ETC = 'ETC',           // 기타
}

export enum NoticeTarget {
    PARTNER = 'PARTNER',
    USER = 'USER',
    ALL = 'ALL',
}

export enum NoticePriority {
    NORMAL = 'NORMAL',       // 일반
    IMPORTANT = 'IMPORTANT', // 중요
    URGENT = 'URGENT',       // 긴급
}