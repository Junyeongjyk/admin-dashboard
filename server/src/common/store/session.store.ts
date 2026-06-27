import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionStore {
    private readonly activeUser = new Map<string, string>();

    getActiveUserId(userId: string) {
        return this.activeUser.get(userId);
    }

    setActiveUserId(userId: string, clientId: string) {
        this.activeUser.set(userId, clientId);
    }
}