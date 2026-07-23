export class AdminChatRoomItemDto {
  roomId?: number;

  userType?: string;

  id?: number;

  name?: string;

  nickname?: string | null;

  region?: string | null;

  introduction?: string | null;

  ratingAvg?: number | null;

  gender?: string | null;

  readCnt?: number;

  lastMessage?: string | null;

  lastMessageAt?: Date | null;
}

export class AdminChatRoomListDto {
    data?: AdminChatRoomItemDto[];

    total?: number;

    currentPage?: number;

    limit?: number;
}