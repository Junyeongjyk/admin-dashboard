import { randomUUID } from "crypto";
import { Envelope, ScopeRole } from "../types/envelope.types";
import { EventType } from "../types/event.types";

export const nowIsoKST = (date = new Date()):string => {
    const tzMs = 9 * 60 * 60 * 1000;
    const kst = new Date(date.getTime() + tzMs);
    return kst.toISOString().replace('Z', '+09:00');
}

export const buildEnvelope = <TPayload>(args: {
    event_type: EventType;
    scope: { role: ScopeRole; user_id: string; request_id?: string };
    payload: TPayload;
    sent_at?: string;
    dedup_key?: string;
}): Envelope<TPayload> => {

    return {
        event_type: args.event_type,
        scope: {
            role: args.scope.role,
            user_id: args.scope.user_id,
            request_id: args.scope.request_id,
        },
        payload: args.payload,
        sent_at: nowIsoKST(),
        dedup_key: args.dedup_key ?? randomUUID(),
    };
}