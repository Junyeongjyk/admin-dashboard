import mqtt, { type MqttClient } from 'mqtt';
import type { Envelope } from "./Envelope";

class DedupCache {
    private map = new Map<string, number>();
    constructor(private ttlMs = 2 * 60 * 1000) {}
    seen(key?: string) {
        if (!key) return false;
        const now = Date.now();
        for (const [k, exp] of this.map) if (exp <= now) this.map.delete(k);
        const exp = this.map.get(key);
        if (exp && exp > now) return true;
        this.map.set(key, now + this.ttlMs);
        return false;
    }
}

export const connectRealtimeSub = (opts: {
  wsUrl: string;
  topic: string;
  userId: string;
  clientId: string;
  username: string;
  password: string;
  onStatus: (s: string) => void;
  onEnvelope: (env: Envelope) => void;
}): MqttClient => {
  console.log('[mqtt] opts=', opts);

  const dedup = new DedupCache();

  const client = mqtt.connect(opts.wsUrl, {
    clientId: opts.clientId,
    username: opts.username,
    password: opts.password,
    clean: true,
    reconnectPeriod: 15000,
    connectTimeout: 40000,
    keepalive: 60,
  });

  client.on('connect', () => {
    console.log('[mqtt] connect');
    opts.onStatus(`connected (${opts.clientId})`);
    
    // 💡 수정 완료: Error | null 로 변경하여 호환성 해결
    client.subscribe(opts.topic, { qos: 1 }, (err: Error | null) => {
      if (err) opts.onStatus(`subscribe error: ${String(err)}`);
      else opts.onStatus(`subscribed ${opts.topic}`);
    });
  });

  client.on('message', (_t: string, buf: Buffer) => {
    try {
      const envJson = JSON.parse(buf.toString()) ;
      const env: Envelope = envJson.data

      if (dedup.seen(env.dedup_key)) return;
      if (env.scope?.user_id !== opts.userId) return;

      opts.onEnvelope(env);
    } catch (e: unknown) { // 💡 수정 완료: any를 unknown으로 바꾸어 ESLint 통과
      console.log('[mqtt] parse error', e);
    }
  });

  client.on('reconnect', () => console.log('[mqtt] reconnect'));
  client.on('close', () => console.log('[mqtt] close'));
  client.on('offline', () => console.log('[mqtt] offline'));
  client.on('error', (e: Error) => console.log('[mqtt] error', e));

  return client;
};