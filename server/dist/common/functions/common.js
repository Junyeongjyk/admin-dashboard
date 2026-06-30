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
exports.maskEmail = exports.formatDate = exports.dateFormatFotKorea = exports.nowKstIso = exports.generate6DigitCode = exports.getCurrentTime = exports.getHex512 = exports.nowDate = void 0;
const crypto = __importStar(require("crypto"));
const nowDate = () => {
    const nowDate = new Date;
    const setTimeZone = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)); // Asia/Seoul
    return setTimeZone.toISOString().slice(0, 19).replace('T', ' ');
};
exports.nowDate = nowDate;
const getHex512 = (msg) => {
    return crypto.createHash('sha512').update(msg).digest('hex');
};
exports.getHex512 = getHex512;
const getCurrentTime = () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${yy}:${MM}:${dd}:${HH}:${mm}`;
};
exports.getCurrentTime = getCurrentTime;
const generate6DigitCode = () => {
    const n = Math.floor(Math.random() * 1_000_000);
    return String(n).padStart(6, '0');
};
exports.generate6DigitCode = generate6DigitCode;
const nowKstIso = () => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().replace('Z', '+09:00');
};
exports.nowKstIso = nowKstIso;
const dateFormatFotKorea = (date) => {
    return new Date(new Date(date || new Date()).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
};
exports.dateFormatFotKorea = dateFormatFotKorea;
const formatDate = (date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};
exports.formatDate = formatDate;
const maskEmail = (email) => {
    if (!email || !email.includes('@'))
        return '';
    const [localPart, domainPart] = email.split('@');
    const domainTokens = domainPart.split('.');
    const domainName = domainTokens[0] || '';
    const domainSuffix = domainTokens.slice(1).join('.');
    const maskPart = (value, visibleCount = 2) => {
        if (!value)
            return '';
        if (value.length <= 1)
            return '*';
        if (value.length <= visibleCount) {
            return value.substring(0, 1) + '*'.repeat(value.length - 1);
        }
        return value.substring(0, visibleCount) + '*'.repeat(value.length - visibleCount);
    };
    const maskedLocal = maskPart(localPart, 2);
    const maskedDomain = maskPart(domainName, 2);
    return domainSuffix
        ? `${maskedLocal}@${maskedDomain}.${domainSuffix}`
        : `${maskedLocal}@${maskedDomain}`;
};
exports.maskEmail = maskEmail;
//# sourceMappingURL=common.js.map