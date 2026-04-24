import * as crypto from 'crypto';
import { getCurrentTime, getHex512 } from './common';
import { BadRequestException } from '@nestjs/common';


const addMinutes = (date: Date, minutes: number):Date => {
    return new Date(date.getTime() + minutes * 60_000);
}

const formatYYMMDDHHmm = (d: Date): string => {
    const yy = String(d.getFullYear() % 100).padStart(2, '0');
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${yy}:${MM}:${dd}:${HH}:${mm}`;
}


export const createKey = () => {
    const time = getCurrentTime()
    const initKey = time + 'detective'
    const rst = getHex512(initKey)
    return rst.slice(0, 32)
}

export const encrypt = (keyUtf8: string, plainText: string):string => {

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

}

export const decrypt = (key: string, encText: string) => {

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
}

export const getDecryptData = (encData: string, label: string) => {

    const now = new Date();
    for (let i = 0; i <= 2; i++) {
        
        let dateTime: Date;
        if (i === 0) dateTime = now;
        else if (i === 1) dateTime = addMinutes(now, 1);
        else dateTime = addMinutes(now, -1);

        const time = formatYYMMDDHHmm(dateTime)
        const initKey = time + 'detective'

        try {
            
            const rst = getHex512(initKey);
            const key = rst.substring(0, 32);

            const decData = decrypt(key, encData);

            return decData;

        } catch (error) {
            console.warn(`복호화 실패 (${i}차 시도)`);

        }

        console.debug(`${i}순차 , key : ${initKey}`);

    }

    throw new BadRequestException(`잘못된 ${label} 암호화 데이터입니다.`);

}