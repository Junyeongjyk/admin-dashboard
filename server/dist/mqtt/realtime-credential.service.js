"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RealtimeCredentialService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeCredentialService = void 0;
// realtime-credential.service.ts
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const mqtt = __importStar(require("mqtt"));
const dynsec_service_1 = require("./dynsec.service");
const credential_store_1 = require("../common/store/credential.store");
let RealtimeCredentialService = RealtimeCredentialService_1 = class RealtimeCredentialService {
    dynsec;
    store;
    logger = new common_1.Logger(RealtimeCredentialService_1.name);
    constructor(dynsec, store) {
        this.dynsec = dynsec;
        this.store = store;
    }
    /** 발급 직후 "진짜로 접속 가능한지" 강제 검증 */
    async verifyConnect(opts) {
        await new Promise((resolve, reject) => {
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
                c.subscribe(opts.topic, { qos: 1 }, (err) => {
                    clearTimeout(timer);
                    c.end(true);
                    if (err) {
                        // mqtt.js: SUBACK 실패면 err.packet.granted = [128]
                        const granted = err?.packet?.granted;
                        const msg = `Subscribe failed topic=${opts.topic} username=${opts.username} granted=${JSON.stringify(granted)} message=${err?.message ?? String(err)}`;
                        reject(new Error(msg));
                        return;
                    }
                    resolve();
                });
            });
            c.once('error', (e) => {
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
    async issueOnLogin(args) {
        const brokerUrl = process.env.MQTT_URL ?? 'mqtt://127.0.0.1:1883';
        const topic = process.env.REALTIME_TOPIC ?? 'v1/realtime';
        console.log('brokerUrl', brokerUrl);
        const existing = this.store.get(args.userId, args.deviceId);
        if (existing) {
            return { username: existing.mqttUsername, password: existing.mqttPassword };
        }
        // 권장: 결정적 username(서버 재시작/중복에도 강함)
        const username = `u_${args.userId}_${args.deviceId}`;
        const password = (0, crypto_1.randomBytes)(24).toString('base64url');
        try {
            //dynsec 반영(없으면 생성, 있으면 비번 맞추기)
            await this.dynsec.ensureRealtimeSubRole();
            await this.dynsec.ensureUser(username, password, 'realtime_sub');
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
        }
        catch (e) {
            this.logger.error(`MQTT provisioning/verify failed: ${e?.message ?? String(e)}`, e);
            // 실패 시 쓰레기 계정 정리(가능한 경우)
            try {
                await this.dynsec.deleteUser(username);
            }
            catch (e2) {
                this.logger.warn(`cleanup deleteUser failed: ${String(e2)}`);
            }
            throw new common_1.UnauthorizedException('MQTT credential provisioning failed');
        }
    }
    /** 로그아웃 시 즉시 revoke */
    async revokeOnLogout(args) {
        const rec = this.store.get(args.userId, args.deviceId);
        if (!rec)
            return { ok: true, revoked: false };
        this.logger.log(`revoke mqtt cred user=${args.userId} device=${args.deviceId} mqttUsername=${rec.mqttUsername}`);
        try {
            await this.dynsec.deleteUser(rec.mqttUsername);
        }
        catch (e) {
            this.logger.warn(`dynsec deleteUser failed: ${String(e)}`);
        }
        this.store.delete(args.userId, args.deviceId);
        return { ok: true, revoked: true };
    }
};
exports.RealtimeCredentialService = RealtimeCredentialService;
exports.RealtimeCredentialService = RealtimeCredentialService = RealtimeCredentialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof dynsec_service_1.DynsecService !== "undefined" && dynsec_service_1.DynsecService) === "function" ? _a : Object, credential_store_1.CredentialStore])
], RealtimeCredentialService);
//# sourceMappingURL=realtime-credential.service.js.map