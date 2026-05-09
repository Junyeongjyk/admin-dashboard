export enum SearchType {
    TITLE = 'TITLE',  //제목
    CONTENT = 'CONTENT', // 내용
    AUTHOR = 'AUTHOR' //작성자
}

export enum PageType {
    LIST = 'LIST', //리스트
    WRITE = 'WRITE', // 등록
    DETAIL = 'DETAIL' // 상세
}

export enum CommunityPostType {
    GENERAL = 'GENERAL',     // 일반 글
    QUESTION = 'QUESTION',   // 질문
    SHARE = 'SHARE',         // 정보/경험 공유
    REVIEW = 'REVIEW',       // 후기
    OPINION = 'OPINION',     // 의견/토론
    REQUEST = 'REQUEST',     // 요청/제안
    REPORT = 'REPORT',       // 제보/신고성 글
}


export const CommunityCategoryLabel: Record<CommunityPostType | string, string> = {
    [CommunityPostType.GENERAL]: '일반',
    [CommunityPostType.QUESTION]: '질문',
    [CommunityPostType.SHARE]: '정보 공유',
    [CommunityPostType.REVIEW]: '후기',
    [CommunityPostType.OPINION]: '의견/토론',
    [CommunityPostType.REQUEST]: '요청/제안',
    [CommunityPostType.REPORT]: '제보/신고',
}