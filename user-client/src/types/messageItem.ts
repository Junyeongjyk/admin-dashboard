import type { biddingItem } from "./biddings";

export interface RoomItem {
    id: number, 
    userId: number,
    // category: string,
    title: string,
    name: string,
    // contents:string,
    // status: number,
    // province: string,
    createdAt: string,
    profileImage?: string;
    // updatedAt: string,
    // detectiveId: number | null,
    // weeks: number | null,
    // amount: number | null,
    // biddings: biddingItem[] | null
}