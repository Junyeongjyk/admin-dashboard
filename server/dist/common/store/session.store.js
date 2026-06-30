"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
const common_1 = require("@nestjs/common");
let SessionStore = class SessionStore {
    activeUser = new Map();
    getActiveUserId(userId) {
        return this.activeUser.get(userId);
    }
    setActiveUserId(userId, clientId) {
        this.activeUser.set(userId, clientId);
    }
};
exports.SessionStore = SessionStore;
exports.SessionStore = SessionStore = __decorate([
    (0, common_1.Injectable)()
], SessionStore);
//# sourceMappingURL=session.store.js.map