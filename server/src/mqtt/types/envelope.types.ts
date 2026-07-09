import { UserType } from "../../common/enum/user.enum";
import { EventType } from "./event.types";

// export type EventType =
//   | 'CHAT_MESSAGE_CREATE'
//   | 'CHAT_MESSAGE_READ'
//   | 'AUTH_FORCE_LOGOUT'
//   | 'ERROR';

export type ScopeRole = UserType.USER | UserType.PARTNER | UserType.ADMIN;

export type Envelope<TPayload = any> = {
    event_type: EventType;

    scope: {
        role: ScopeRole;
        user_id: string;       // 수신 대상 또는 발신자 (여기서는 "수신 대상"으로 쓰는 걸 권장)
        request_id?: string;
    };

    payload: TPayload;

    sent_at: string;         // ISO8601 (+09:00 or Z)
    dedup_key?: string;      // QoS1 중복 대비 키
};

export type ErrorPayload = {
    code: string;
    message: string;
    detail?: Record<string, any>;
};

export type ForceLogoutPayload = {
    reason: 'DUPLICATE_LOGIN' | string;
    kicked_by_session_id?: string;
    at?: string;
};