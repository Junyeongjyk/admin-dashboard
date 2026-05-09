import type { partner } from "./partner";

export interface biddingItem {
    id: number,
    amount: number,
    createdAt: string,
    weeks: number, 
    partner: partner   
}