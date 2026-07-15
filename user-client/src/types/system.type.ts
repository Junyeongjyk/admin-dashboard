export interface SystemOption {
    commission: number,
    accountName: string,
    accountNumber: string,
    bank: string,
    createdAt: string,
    id: number,
    updatedAt: string,
    useIpAccessControl: boolean
}

export interface BanWords {
    id: number,
    word: string,
    createdAt: string,
    updatedAt: string
}

export interface BannerItem {
    position: string,
    title: string,
    content: string,
    buttonTitle?: string | null,
    link?: string | null
}
