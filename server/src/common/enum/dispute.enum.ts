export enum DisputeType {
    QUALITY = 'QUALITY',       // 결과/품질 불만
    DELAY = 'DELAY',           // 지연/납기 문제
    COST = 'COST',             // 비용/실비/정산 이슈
    COMMUNICATION = 'COMMUNICATION', // 소통 문제
    MISCONDUCT = 'MISCONDUCT', // 부적절 행위
    ETC = 'ETC',               // 기타
}

export enum DisputeStatus {
    OPEN = 'OPEN',             // 접수됨
    IN_REVIEW = 'IN_REVIEW',   // 검토중
    RESOLVED = 'RESOLVED',     // 해결됨
    REJECTED = 'REJECTED',     // 반려/기각
    CLOSED = 'CLOSED',         // 종료
}

export enum DisputeCategory {
    PAYMENT = 'PAYMENT',     // 결제/환불
    SERVICE = 'SERVICE',     // 서비스 이용
    ACCOUNT = 'ACCOUNT',     // 계정/인증
    CONTRACT = 'CONTRACT',   // 계약/진행
    SECURITY = 'SECURITY',   // 보안/개인정보
    ETC = 'ETC',             // 기타
    ALL = 'ALL',             // 모두
}