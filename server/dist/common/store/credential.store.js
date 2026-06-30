"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialStore = void 0;
// credential.store.ts
const common_1 = require("@nestjs/common");
let CredentialStore = class CredentialStore {
    map = new Map();
    key(userId, deviceId) {
        return `${userId}::${deviceId}`;
    }
    get(userId, deviceId) {
        return this.map.get(this.key(userId, deviceId));
    }
    set(v) {
        this.map.set(this.key(v.userId, v.deviceId), v);
    }
    delete(userId, deviceId) {
        this.map.delete(this.key(userId, deviceId));
    }
};
exports.CredentialStore = CredentialStore;
exports.CredentialStore = CredentialStore = __decorate([
    (0, common_1.Injectable)()
], CredentialStore);
//# sourceMappingURL=credential.store.js.map