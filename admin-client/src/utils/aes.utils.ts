import type { ApiBaseResponse } from "src/types/apiBaseResponse"
import { getHashCode, got } from "./helpers"
import { popup } from "./popup"
import CryptoJS from 'crypto-js';

const formatToYYMMDDHHmm = (dateTime: string): string => {
    const [datePart, timePart] = dateTime.split(" ");
    const [yyyy, MM, dd] = datePart.split("-");
    const [HH, mm] = timePart.split(":");

    const yy = yyyy.slice(2);

    return `${yy}:${MM}:${dd}:${HH}:${mm}`;
};

const parseServerTimeStringToDate = (serverTimeStr: string, tz: 'KST' | 'UTC' = 'KST'): Date => {
    const m = serverTimeStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);

    if (!m) throw new Error(`Invalid serverTime format: ${serverTimeStr}`);
    
    const year = Number(m[1]);
    const month = Number(m[2]); // 1-12
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    const second = Number(m[6]);

    if (tz === 'UTC') {
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    }

    return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));
}

const getServerTimeFromApi = async (): Promise<Date> => {
    const response: ApiBaseResponse = await got('/api/v1/serverTime')
    if (response.status == 1) {
        return parseServerTimeStringToDate(response.data)
    } else {
        return new Date()
    }
} 

const getNowFormatTime = (format: string, koreaTime: Date) => {
    const now = new Date(koreaTime.getTime());

    const replacements: Record<string, string> = {
        'yyyy': now.getFullYear().toString(),
        'yy': now.getFullYear().toString().slice(-2), // ← 2자리 연도
        'MM': String(now.getMonth() + 1).padStart(2, '0'),
        'dd': String(now.getDate()).padStart(2, '0'),
        'HH': String(now.getHours()).padStart(2, '0'),
        'mm': String(now.getMinutes()).padStart(2, '0')
    };

    return format.replace(/yyyy|yy|MM|dd|HH|mm/g, match => replacements[match]);
}


export const createKey = async () => {
    const response: ApiBaseResponse = await got('/api/v1/serverTime')

    // console.log('response', response)
    if (response.status == 1) {
        const serverTime:string = response.data;
        const time = formatToYYMMDDHHmm(serverTime)

        const initKey = time + 'detective'
        const rst = await getHashCode(initKey)

        return rst.slice(0, 32)
    } else {
        popup(response.message)
        return ''
    }
}

export const encrypt = async (key: string, plainText: string) => {
    const initKey = key

    const iv = CryptoJS.lib.WordArray.random(16)
    const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(initKey), {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7, // PKCS7 패딩 방식
        mode: CryptoJS.mode.CBC, // CBC 모드
    });

    const combined = iv.concat(encrypted.ciphertext)
    return CryptoJS.enc.Base64.stringify(combined)
}



const decrypt = (key: string, encText: string) => {
    const combined = CryptoJS.enc.Base64.parse(encText)
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4))
    const encryptedBytes = CryptoJS.lib.WordArray.create(combined.words.slice(4))

    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encryptedBytes,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7, // PKCS7 패딩 방식
        mode: CryptoJS.mode.CBC, // CBC 모드
    });

    const plain = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plain) throw new Error('decrypt failed');
    return plain;
}




export const getDecryptData = async (encText:string) => {
    const now = await getServerTimeFromApi()

    for (let i = 0; i <= 2; i++ ) {
        let date: Date;
        if (i === 0) date = new Date(now.getTime());
        else if (i === 1) date = new Date(now.getTime() + 60_000);
        else date = new Date(now.getTime() - 60_000);


        const formattedTime = getNowFormatTime('yy:MM:dd:HH:mm', date);

        let initKey = formattedTime + 'detective'
        const hash = await getHashCode(initKey); // SHA-512
        const key = hash.slice(0, 32); // AES256용 키 (첫 32자)

        
        try {
            const decrypted = decrypt(key, encText)
            return decrypted;
        } catch (e) {
            console.log("복호화 실패", i);
        }
    }   
    
    throw new Error(`decrypt error`);
    
}