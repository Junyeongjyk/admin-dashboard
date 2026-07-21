export const validateEmail = (email: string) : { ok: true } | { ok: false; message: string } => {
    if (!email?.trim()) {
        return { ok: false, message: "이메일은 필수 입력값입니다." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { ok: false, message: "유효한 이메일 형식이 아닙니다." };
    }

    return { ok: true };
}

export const validatePassword = (pw: string) : { ok: true } | { ok: false; message: string } => {

    if (!pw?.trim()) {
        return { ok: false, message: "비밀번호는 필수 입력값입니다." };
    }

    if (pw.length < 8) {
        return { ok: false, message: "비밀번호는 최소 8자 이상이어야 합니다." };
    }

    if (pw.length > 20) {
        return { ok: false, message: "비밀번호는 최대 20자입니다." };
    }

    const policy = /^(?=(?:.*[^A-Za-z0-9]){2,}).{8,20}$/;
    if (!policy.test(pw)) {
        return { ok: false, message: "비밀번호는 특수문자를 2개 이상 포함해야 합니다." };
    }

    return { ok: true };

}

// export const validateName = (name: string) => {
//     if (!name?.trim()) {
//         return { ok: false, message: "이름은 필수 입력값입니다." }; 
//     }
    
//     return { ok: true };
// }



// export const validateName = (name: string) => {
//     if (!name) throw new BadRequestException('이름은 필수 입력값입니다.');
// }

// export const validateAddress = (address: string) => {
//     if (!address) throw new BadRequestException('주소는 필수 입력값입니다.');
// }

export const validateZipCode = (zip: string) : { ok: true } | { ok: false; message: string }=> {
    if (!zip?.trim()) {
        return { ok: false, message: "전화번호는 필수 입력값입니다." };
    }
    
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zip)) {
        return { ok: false, message: "우편번호는 숫자 5자리여야 합니다." };
    }

    return { ok: true };
}

export const validatePhoneNumber = (phone: string) : { ok: true } | { ok: false; message: string }  => {

    if (!phone?.trim()) {
        return { ok: false, message: "전화번호는 필수 입력값입니다." };
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
        return { ok: false, message: "올바른 전화번호 형식이 아닙니다." };
    }

    return { ok: true };
}

export const validateAuthCode = (code: string) : { ok: true } | { ok: false; message: string } => {

    if (!code?.trim()) {
        return { ok: false, message: "인증코드는 필수 입력값입니다." };
    }

    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
        return { ok: false, message: "인증코드는 숫자 6자리여야 합니다." };
    }
    
    return { ok: true };
}

export const validateStringBasic = (txt: string, label: string) : { ok: true } | { ok: false; message: string } => {
    if (!txt?.trim()) {
        return { ok: false, message: `${label}은 필수 입력값입니다.` };
    }
    
    return { ok: true };
}