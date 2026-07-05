export interface CommunityComment {
    id: number;
    parentId: number | null;
    authorId: number;
    authorName: string;
    content: string;
    createdAt: string;

    // 대댓글 / 대대댓글
    children: CommunityComment[];
}

export interface CommunityItem {
    id:number,
    title: string,
    category: string,
    authorId: number,
    authorName: string,
    likeCount: number,
    viewCount: number,
    createdAt: string,
    content?: string,
    comments?: CommunityComment[];
    commentCount?: number; 
    thumbnail?: string,  
}



