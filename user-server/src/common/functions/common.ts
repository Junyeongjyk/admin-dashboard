import * as crypto from 'crypto';

export const nowDate = () => {
    const nowDate = new Date
    const setTimeZone = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)) // Asia/Seoul
    return setTimeZone.toISOString().slice(0, 19).replace('T', ' ');
}

export const getHex512 = (msg: string) => {
    return crypto.createHash('sha512').update(msg).digest('hex'); 
}

export const getCurrentTime = (): string => {
    const now = new Date();

    const yy = String(now.getFullYear()).slice(-2);
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    return `${yy}:${MM}:${dd}:${HH}:${mm}`;
}

export const generate6DigitCode = ():string => {
    const n = Math.floor(Math.random() * 1_000_000);
    return String(n).padStart(6, '0');
}

export const nowKstIso = () => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().replace('Z', '+09:00');
}

export const dateFormatFotKorea = (date?: string | Date): Date => {
    return new Date(new Date(date || new Date()).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

export const formatDate = (date: Date): string => {
    const d = new Date(date);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

}


export const maskEmail = (email: string): string => {
    if (!email || !email.includes('@')) return '';

    const [localPart, domainPart] = email.split('@');

    const domainTokens = domainPart.split('.');
    const domainName = domainTokens[0] || '';
    const domainSuffix = domainTokens.slice(1).join('.');

    const maskPart = (value: string, visibleCount: number = 2): string => {
        if (!value) return '';
        if (value.length <= 1) return '*';
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
}