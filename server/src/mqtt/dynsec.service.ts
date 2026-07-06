// dynsec.service.ts
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import { randomUUID } from 'crypto';


type DynsecResponseEnvelope = {
  responses?: Array<{
    command?: string;
    correlationData?: string;
    error?: string;
    message?: string;
    data?: any;
  }>;
};

@Injectable()
export class DynsecService implements OnModuleInit {
  private readonly logger = new Logger(DynsecService.name);
  private client!: MqttClient;

  private readyResolve!: () => void;
  private ready = new Promise<void>((res) => (this.readyResolve = res));

  private readonly controlTopic = process.env.MQTT_DYNSEC_TOPIC ?? '$CONTROL/dynamic-security/v1';

  async onModuleInit() {
    const url = process.env.MQTT_URL ?? 'mqtt://127.0.0.1:1883';

    this.client = mqtt.connect(url, {
      clientId: `SERVER-dynsec-${process.pid}-${randomUUID().slice(0, 8)}`,
      username: process.env.MQTT_ADMIN_USERNAME,
      password: process.env.MQTT_ADMIN_PASSWORD,
      clean: true,
      keepalive: 60,
      reconnectPeriod: 2000,
      connectTimeout: 30_000,
    });

    this.client.on('connect', () => {
      this.logger.log('dynsec connected');
      this.readyResolve();

      // ✅ connect 이후에 "한 번만, 순서대로" role/acl 보장 (레이스 제거)
      void (async () => {
        try {
          await this.ensureRealtimeSubRole();      // subscribe ACL 보장
          await this.ensureRealtimePubForAdmin();  // publish ACL + admin role 보장
          this.logger.log('dynsec roles ensured: realtime_sub + realtime_pub(for admin)');
        } catch (e: any) {
          this.logger.error(`dynsec ensure roles failed: ${e?.message ?? e}`, e);
        }
      })();
    });

    this.client.on('error', (e) => this.logger.error('dynsec error', e as any));
  }

  /** PUBACK만 확인하는 기존 cmd (일단 유지) */
  private async cmd(command: any): Promise<void> {
    await this.ready;

    const msg = JSON.stringify({ commands: [command] });

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => {
        reject(new Error(`dynsec cmd timeout: ${command?.command}`));
      }, 8000);

      this.client.publish('$CONTROL/dynamic-security/v1', msg, { qos: 1 }, (err) => {
        clearTimeout(t);
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async ensureRealtimeSubRole() {
    const role = 'realtime_sub';

    try {
      await this.cmd({ command: 'createRole', rolename: role });
    } catch {}

    // ✅ 딱 v1/realtime 구독 허용
    try {
      await this.cmd({
        command: 'addRoleACL',
        rolename: role,
        acltype: 'subscribePattern',
        topic: 'v1/realtime',
        priority: 0,
        allow: true,
      });
    } catch {}

    // (추천) 앞으로 하위 토픽 쓸 거면 아래로 교체:
    // topic: 'v1/realtime/#'
  }

  // ----------------------------
  // ✅ 핵심: role + ACL 보장
  // ----------------------------
  private async ensureRoleForRealtime() {
    const role = 'realtime_sub';

    // 1) role이 없으면 생성
    try {
      await this.cmd({ command: 'createRole', rolename: role });
    } catch (e) {
      // 이미 있으면 무시
      this.logger.warn(`createRole maybe exists: ${String(e)}`);
    }

    // 2) role ACL 추가: v1/realtime 구독 허용
    // - 정확히 v1/realtime만 구독하면 이걸로 충분
    // - 만약 나중에 하위 토픽도 쓰면 'v1/realtime/#' 로 바꿔야 함
    try {
      await this.cmd({
        command: 'addRoleACL',
        rolename: 'realtime_sub',
        acltype: 'publishClientSend',
        topic: 'v1/realtime',
        priority: 0,
        allow: true,
      });
    } catch (e) {
      // 이미 있으면 무시
      this.logger.warn(`addRoleACL subscribePattern maybe exists: ${String(e)}`);
    }

    // (옵션) 퍼블리시도 필요하면 추가
    // await this.cmd({
    //   command: 'addRoleACL',
    //   rolename: role,
    //   acltype: 'publishClientSend',
    //   topic: 'v1/realtime',
    //   priority: 0,
    //   allow: true,
    // });
  }

  async createClient(username: string, password: string) {
    await this.cmd({ command: 'createClient', username, password });
    await this.cmd({ command: 'enableClient', username });
  }

  async setClientPassword(username: string, password: string) {
    await this.cmd({ command: 'setClientPassword', username, password });
  }

  async addRole(username: string, roleName: string) {
    await this.cmd({ command: 'addClientRole', username, rolename: roleName });
  }

  async deleteClient(username: string) {
    await this.cmd({ command: 'deleteClient', username });
  }


  async ensureClient(username: string, password: string, roleName: string) {
    try {
      await this.createClient(username, password);
    } catch (e: any) {
      this.logger.warn(`createClient failed (maybe exists): ${e?.message ?? e}`);
      await this.setClientPassword(username, password);
      await this.cmd({ command: 'enableClient', username });
    }

    await this.addRole(username, roleName);
  }

  async deleteClientSafe(username: string): Promise<{ deleted: boolean; reason?: string }> {
    try {
      await this.deleteClient(username);
      return { deleted: true };
    } catch (e: any) {
      const msg = e?.message ?? String(e);

      // mqtt.js publish 단계 에러/네트워크 등은 그대로 알리기(원하면 swallow 가능)
      // dynsec response 기반이면 여기서 "Client not found" 같은 문자열이 들어옴

      // ✅ "없는 계정"은 자주 발생(중복 로그아웃/서버 재시작/정리 작업 등)
      if (/not\s*found|unknown\s*client|does\s*not\s*exist/i.test(msg)) {
        this.logger.warn(`dynsec deleteClient: already missing username=${username} (${msg})`);
        return { deleted: false, reason: 'missing' };
      }

      // ✅ 권한 문제면 configuration 이슈이므로 강하게 로그
      if (/not\s*authorized|permission/i.test(msg)) {
        this.logger.error(`dynsec deleteClient: not authorized username=${username} (${msg})`, e);
        return { deleted: false, reason: 'not_authorized' };
      }

      this.logger.warn(`dynsec deleteClient failed username=${username}: ${msg}`, e);
      return { deleted: false, reason: 'failed' };
    }
  }

  async ensureRealtimePubRole() {
    const role = 'realtime_pub';

    // role 없으면 생성
    try {
      await this.cmd({ command: 'createRole', rolename: role });
    } catch {}

    // v1/realtime publish 허용
    try {
      await this.cmd({
        command: 'addRoleACL',
        rolename: role,
        acltype: 'publishClientSend',
        topic: 'v1/realtime',
        priority: 0,
        allow: true,
      });
    } catch {}
  }

  async ensureRealtimePubForAdmin() {
    const role = 'realtime_pub';
    const username = 'admin';

    // role 생성(없으면)
    try {
      await this.cmd({ command: 'createRole', rolename: role });
    } catch {}

    // publish 권한 부여(없으면)
    try {
      await this.cmd({
        command: 'addRoleACL',
        rolename: role,
        acltype: 'publishClientSend',
        topic: 'v1/realtime', // 하위까지 필요하면 'v1/realtime/#'
        priority: 0,
        allow: true,
      });
    } catch {}

    // admin에 role 부여(이미 있으면 에러 무시)
    try {
      await this.cmd({ command: 'addClientRole', username, rolename: role });
    } catch {}
  }
}