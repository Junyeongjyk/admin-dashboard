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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
exports.Token = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies['access-token'];
    if (!token) {
        throw new common_1.BadRequestException('유효하지 않는 접근입니다. 토큰이 없습니다.');
    }
    else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        if (!data) {
            new common_1.BadRequestException('유효하지 않는 접근입니다. 데이터가 없습니다.');
        }
        else {
            if (data.includes(decoded.type)) {
                return decoded;
            }
        }
        throw new common_1.BadRequestException('유효하지 않는 접근입니다.');
    }
});
//# sourceMappingURL=token.decorator.js.map