import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionStore {
    private readonly activeClient = new Map<string, string>();

    getActiveClientId(userId: string) {
        return this.activeClient.get(userId);
    }

    setActiveClientId(userId: string, clientId: string) {
        this.activeClient.set(userId, clientId);
    }
}