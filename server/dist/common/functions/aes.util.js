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
exports.getDecryptData = exports.decrypt = exports.encrypt = exports.createKey = void 0;
const crypto = __importStar(require("crypto"));
const common_1 = require("./common");
const common_2 = require("@nestjs/common");
const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60_000);
};
const formatYYMMDDHHmm = (d) => {
    const yy = String(d.getFullYear() % 100).padStart(2, '0');
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${yy}:${MM}:${dd}:${HH}:${mm}`;
};
const createKey = () => {
    const time = (0, common_1.getCurrentTime)();
    const initKey = time + 'partner';
    const rst = (0, common_1.getHex512)(initKey);
    return rst.slice(0, 32);
};
exports.createKey = createKey;
const encrypt = (keyUtf8, plainText) => {
    const key = Buffer.from(keyUtf8, 'utf8');
    const iv = crypto.randomBytes(16);
    if (![16, 24, 32].includes(key.length)) {
        throw new Error(`Invalid AES key length: ${key.length}. Must be 16/24/32 bytes (AES-128/192/256).`);
    }
    const algo = key.length === 16 ? 'aes-128-cbc' : key.length === 24 ? 'aes-192-cbc' : 'aes-256-cbc';
    const cipher = crypto.createCipheriv(algo, key, iv);
    cipher.setAutoPadding(true); // PKCS7 padding (Java PKCS5Padding과 호환)
    const encrypted = Buffer.concat([
        cipher.update(Buffer.from(plainText, 'utf8')),
        cipher.final(),
    ]);
    const combined = Buffer.concat([iv, encrypted]); // IV + ciphertext
    return combined.toString('base64');
};
exports.encrypt = encrypt;
const decrypt = (key, encText) => {
    const combined = Buffer.from(encText, 'base64');
    const iv = combined.subarray(0, 16);
    const encryptedBytes = combined.subarray(16);
    const keyBuffer = Buffer.from(key, 'utf8');
    if (![16, 24, 32].includes(keyBuffer.length)) {
        throw new Error(`Invalid AES key length: ${keyBuffer.length}. Must be 16/24/32 bytes.`);
    }
    const algorithm = keyBuffer.length === 16 ? 'aes-128-cbc' : keyBuffer.length === 24 ? 'aes-192-cbc' : 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    decipher.setAutoPadding(true); // PKCS7 (Java PKCS5Padding과 호환)
    const decrypted = Buffer.concat([
        decipher.update(encryptedBytes),
        decipher.final()
    ]);
    return decrypted.toString('utf8');
};
exports.decrypt = decrypt;
const getDecryptData = (encData, label) => {
    const now = new Date();
    for (let i = 0; i <= 2; i++) {
        let dateTime;
        if (i === 0)
            dateTime = now;
        else if (i === 1)
            dateTime = addMinutes(now, 1);
        else
            dateTime = addMinutes(now, -1);
        const time = formatYYMMDDHHmm(dateTime);
        const initKey = time + 'partner';
        try {
            const rst = (0, common_1.getHex512)(initKey);
            const key = rst.substring(0, 32);
            const decData = (0, exports.decrypt)(key, encData);
            return decData;
        }
        catch (error) {
            console.warn(`복호화 실패 (${i}차 시도)`);
        }
        console.debug(`${i}순차 , key : ${initKey}`);
    }
    throw new common_2.BadRequestException(`잘못된 ${label} 암호화 데이터입니다.`);
};
exports.getDecryptData = getDecryptData;
//# sourceMappingURL=aes.util.js.map