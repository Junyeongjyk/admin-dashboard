import type { SignupType } from "src/types/enum/userEnum";

export enum EventType {
    CHAT_MESSAGE_CREATE = 'CHAT_MESSAGE_CREATE',
    CHAT_MESSAGE_READ   = 'CHAT_MESSAGE_READ',
    AUTH_FORCE_LOGOUT   = 'AUTH_FORCE_LOGOUT', //중복 로그아웃
    ERROR               = 'ERROR',
}

export type Envelope<TPayload = unknown> = {
    event_type: EventType;
    scope: {
        role: SignupType;
        user_id: string;      // 단일 토픽이므로 “수신 대상”
        request_id?: string;
    };
    payload: TPayload;
    sent_at: string;
    dedup_key?: string;
};