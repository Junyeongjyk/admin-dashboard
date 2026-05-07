// credential.store.ts
import { Injectable } from '@nestjs/common';

export type StoredCredential = {
  userId: string;
  deviceId: string;
  clientId: string;
  mqttUsername: string;
  mqttPassword: string;
};

@Injectable()
export class CredentialStore {
  private map = new Map<string, StoredCredential>();

  private key(userId: string, deviceId: string) {
    return `${userId}::${deviceId}`;
  }

  get(userId: string, deviceId: string): StoredCredential | undefined {
    return this.map.get(this.key(userId, deviceId));
  }

  set(v: StoredCredential) {
    this.map.set(this.key(v.userId, v.deviceId), v);
  }

  delete(userId: string, deviceId: string) {
    this.map.delete(this.key(userId, deviceId));
  }
}