export enum CommunityPostType {
    GENERAL = 'GENERAL',     // 일반 글
    QUESTION = 'QUESTION',   // 질문
    SHARE = 'SHARE',         // 정보/경험 공유
    REVIEW = 'REVIEW',       // 후기
    OPINION = 'OPINION',     // 의견/토론
    REQUEST = 'REQUEST',     // 요청/제안
    REPORT = 'REPORT',       // 제보/신고성 글
    ALL = 'ALL'                //모두 표현
}

export enum CommunityCategory {
    USER = 'USER', //일반 회원
    PARTNER = 'PARTNER', //파트너
}

export enum SearchType {
    TITLE = 'TITLE',  //제목
    CONTENT = 'CONTENT', // 내용
    AUTHOR = 'AUTHOR' //작성자
}