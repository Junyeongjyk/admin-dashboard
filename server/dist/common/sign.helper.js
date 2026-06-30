"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sign = void 0;
const common_1 = require("@nestjs/common");
let Sign = class Sign {
    async in(res, accessToken) {
        await res.cookie("access-token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
            maxAge: parseInt(process.env["JWT_EXPIRES"] ?? "3600") * 1000 + (3600000 * 9)
        });
    }
    async out(res) {
        await res.cookie("access-token", null, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
            maxAge: 0
        });
    }
};
exports.Sign = Sign;
exports.Sign = Sign = __decorate([
    (0, common_1.Injectable)()
], Sign);
//# sourceMappingURL=sign.helper.js.map