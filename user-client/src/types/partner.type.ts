export interface PartnerItem {
    id: number,
    type: string,
    name: string, 
    clientId: string,
    username: string,
    password: string
}

export interface PartnerInfo {
    id: number,
    identity: string,
    name: string,
    address: string,
    detailAddress: string,
    zipcode: string,
    isTwoFactorEnabled: boolean,
    isNotificationAgreed: boolean,
    nickname?: string | null,
    userType: string,
    email: string,
    phone: string,
    isEmailVerified: boolean,
    gender: string,
    
}