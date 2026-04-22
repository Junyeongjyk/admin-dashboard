import { BadRequestException } from "@nestjs/common";
import isEmail from 'validator/lib/isEmail';

export const validateIdentity = (email: string) => {
    if (!email) throw new BadRequestException('이메일는 필수 입력값입니다.');
    if (!isEmail(email)) throw new BadRequestException('유효한 이메일 형식이 아닙니다.');
}

export const validateEmail = (email: string) => {
    if (!email) throw new BadRequestException('이메일는 필수 입력값입니다.');
    if (!isEmail(email)) throw new BadRequestException('유효한 이메일 형식이 아닙니다.');
}

export const validatePassword = (pw: string) => {
    if (!pw) throw new BadRequestException('비밀번호는 필수 입력값입니다.');
    if (pw.length < 8) throw new BadRequestException('비밀번호는 최소 8자 이상이어야 합니다.');
    if (pw.length > 20) throw new BadRequestException('비밀번호는 최대 20자입니다.');

    const policy = /^(?=(?:.*[^A-Za-z0-9]){2,}).{8,20}$/;
    if (!policy.test(pw)) {
      throw new BadRequestException('비밀번호는 특수문자를 2개 이상 포함해야 합니다.');
    }
}

export const validateName = (name: string) => {
    if (!name) throw new BadRequestException('이름은 필수 입력값입니다.');
}

export const validateAddress = (address: string) => {
    if (!address) throw new BadRequestException('주소는 필수 입력값입니다.');
}

export const validateZipCode = (zip: string) => {
    if (!zip) throw new BadRequestException('우편번호는 필수 입력값입니다.');
    if (!/^\d{5}$/.test(zip)) {
        throw new BadRequestException('우편번호는 숫자 5자리여야 합니다.');
    }
}

export const validatePhoneNumber = (phone: string) => {
    if (!phone) throw new BadRequestException('전화번호는 필수 입력값입니다.');
    // 숫자만(10~11자리) 예시. 원하면 한국 휴대폰 규칙(01X)으로 강화 가능
    if (!/^\d{10,11}$/.test(phone)) {
      throw new BadRequestException('올바른 전화번호 형식이 아닙니다.');
    }
}

export const validateAuthCode = (zip: string) => {
    if (!zip) throw new BadRequestException('인증코드는 필수 입력값입니다.');
    if (!/^\d{6}$/.test(zip)) {
        throw new BadRequestException('인증코드는 숫자 6자리여야 합니다.');
    }
}

export const validateStringBasic = (txt: string, label: string) => {
    if (!txt) throw new BadRequestException(`${label}은 필수 입력값입니다.`);
}