export interface UserItem {
    id: number,
    type: string,
    name: string, 
    userId: string,
    username: string,
    password: string
}

export interface UserInfo {
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