// realtime-credential.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as mqtt from 'mqtt';
import { DynsecService } from './dynsec.service';
import { CredentialStore } from '../common/store/credential.store';

export type RealtimeCredential = { username: string; password: string };

@Injectable()
export class RealtimeCredentialService {
  private readonly logger = new Logger(RealtimeCredentialService.name);

  constructor(
    private readonly dynsec: DynsecService,
    private readonly store: CredentialStore,
  ) {}

  /** 발급 직후 "진짜로 접속 가능한지" 강제 검증 */
  private async verifyConnect(opts: {
  url: string;
  clientId: string;
  username: string;
  password: string;
  topic?: string;
}) {
  await new Promise<void>((resolve, reject) => {
    const c = mqtt.connect(opts.url, {
      clientId: opts.clientId,
      username: opts.username,
      password: opts.password,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 0,
      keepalive: 30,
    });

    const timer = setTimeout(() => {
      c.end(true);
      reject(new Error('verify timeout'));
    }, 6000);

    c.once('connect', () => {
      if (!opts.topic) {
        clearTimeout(timer);
        c.end(true);
        resolve();
        return;
      }

      c.subscribe(opts.topic, { qos: 1 }, (err: any) => {
        clearTimeout(timer);
        c.end(true);

        if (err) {
          // mqtt.js: SUBACK 실패면 err.packet.granted = [128]
          const granted = err?.packet?.granted;
          const msg = `Subscribe failed topic=${opts.topic} username=${opts.username} granted=${JSON.stringify(
            granted,
          )} message=${err?.message ?? String(err)}`;
          reject(new Error(msg));
          return;
        }

        resolve();
      });
    });

    c.once('error', (e: any) => {
      clearTimeout(timer);
      c.end(true);
      reject(e);
    });
  });
}

  /**
   * 로그인 시 호출:
   * - 기존 발급이 있으면 재사용(원하면 회전 방식으로 바꿀 수도 있음)
   * - 없으면 dynsec로 생성/enable/role 부여하고 verify 후 반환
   */
  async issueOnLogin(args: {
    userId: string;
    deviceId: string;
    clientId: string;
  }): Promise<RealtimeCredential> {
    const brokerUrl = process.env.MQTT_URL ?? 'mqtt://127.0.0.1:1883';
    const topic = process.env.REALTIME_TOPIC ?? 'v1/realtime';

    console.log('brokerUrl', brokerUrl)

    const existing = this.store.get(args.userId, args.deviceId);
    if (existing) {
      return { username: existing.mqttUsername, password: existing.mqttPassword };
    }

    // 권장: 결정적 username(서버 재시작/중복에도 강함)
    const username = `u_${args.userId}_${args.deviceId}`;
    const password = randomBytes(24).toString('base64url');

    try {
      //dynsec 반영(없으면 생성, 있으면 비번 맞추기)
      await this.dynsec.ensureRealtimeSubRole();
      await this.dynsec.ensureClient(username, password, 'realtime_sub');

      // 레이스 완화(환경에 따라 100~500ms)
      await new Promise((r) => setTimeout(r, 300));

      //진짜로 접속/구독 가능한지 검증
      await this.verifyConnect({
        url: brokerUrl,
        clientId: `VERIFY-${args.clientId}`,
        username,
        password,
        topic, // connect + subscribe 검증
      });

      this.store.set({
        userId: args.userId,
        deviceId: args.deviceId,
        clientId: args.clientId,
        mqttUsername: username,
        mqttPassword: password,
      });

      return { username, password };
    } catch (e: any) {
      this.logger.error(
        `MQTT provisioning/verify failed: ${e?.message ?? String(e)}`,
        e,
      );

      // 실패 시 쓰레기 계정 정리(가능한 경우)
      try {
        await this.dynsec.deleteClient(username);
      } catch (e2) {
        this.logger.warn(`cleanup deleteClient failed: ${String(e2)}`);
      }

      throw new UnauthorizedException('MQTT credential provisioning failed');
    }
  }

  /** 로그아웃 시 즉시 revoke */
  async revokeOnLogout(args: { userId: string; deviceId: string }) {
    const rec = this.store.get(args.userId, args.deviceId);
    if (!rec) return { ok: true, revoked: false };

    this.logger.log(
      `revoke mqtt cred user=${args.userId} device=${args.deviceId} mqttUsername=${rec.mqttUsername}`,
    );

    try {
      await this.dynsec.deleteClient(rec.mqttUsername);
    } catch (e) {
      this.logger.warn(`dynsec deleteClient failed: ${String(e)}`);
    }

    this.store.delete(args.userId, args.deviceId);
    return { ok: true, revoked: true };
  }
}