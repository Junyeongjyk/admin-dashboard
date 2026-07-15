export interface RoomItem {
    id:number,
    name: string,
    nickname?: string,
    region?: string,
    careerYears?: string,
    introduction?: string,
    ratingAvg?: string,
    profileImage?: string,
    lastMessageAt?: string,
    lastMessage?: string,
    unreadCount?:number,
    gender?: string,
    roomId?:number
}

export interface MessageItem {
    id: number,
    senderId: number,
    content: string,
    createdAt: string,
    originalName: string,
    mimeType: string,
    size: number,
    chatContentType: boolean
}

export interface SendMessageItem {
    id: number,
    senderId: number,
    content: string,
    createdAt: string,
    roomId:number,
    originalName: string,
    mimeType: string,
    size: number,
    chatContentType: boolean
}