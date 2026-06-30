"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStringBasic = exports.validateAuthCode = exports.validatePhoneNumber = exports.validateZipCode = exports.validateAddress = exports.validateName = exports.validatePassword = exports.validateEmail = exports.validateIdentity = void 0;
const common_1 = require("@nestjs/common");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const validateIdentity = (email) => {
    if (!email)
        throw new common_1.BadRequestException('이메일는 필수 입력값입니다.');
    if (!(0, isEmail_1.default)(email))
        throw new common_1.BadRequestException('유효한 이메일 형식이 아닙니다.');
};
exports.validateIdentity = validateIdentity;
const validateEmail = (email) => {
    if (!email)
        throw new common_1.BadRequestException('이메일는 필수 입력값입니다.');
    if (!(0, isEmail_1.default)(email))
        throw new common_1.BadRequestException('유효한 이메일 형식이 아닙니다.');
};
exports.validateEmail = validateEmail;
const validatePassword = (pw) => {
    if (!pw)
        throw new common_1.BadRequestException('비밀번호는 필수 입력값입니다.');
    if (pw.length < 8)
        throw new common_1.BadRequestException('비밀번호는 최소 8자 이상이어야 합니다.');
    if (pw.length > 20)
        throw new common_1.BadRequestException('비밀번호는 최대 20자입니다.');
    const policy = /^(?=(?:.*[^A-Za-z0-9]){2,}).{8,20}$/;
    if (!policy.test(pw)) {
        throw new common_1.BadRequestException('비밀번호는 특수문자를 2개 이상 포함해야 합니다.');
    }
};
exports.validatePassword = validatePassword;
const validateName = (name) => {
    if (!name)
        throw new common_1.BadRequestException('이름은 필수 입력값입니다.');
};
exports.validateName = validateName;
const validateAddress = (address) => {
    if (!address)
        throw new common_1.BadRequestException('주소는 필수 입력값입니다.');
};
exports.validateAddress = validateAddress;
const validateZipCode = (zip) => {
    if (!zip)
        throw new common_1.BadRequestException('우편번호는 필수 입력값입니다.');
    if (!/^\d{5}$/.test(zip)) {
        throw new common_1.BadRequestException('우편번호는 숫자 5자리여야 합니다.');
    }
};
exports.validateZipCode = validateZipCode;
const validatePhoneNumber = (phone) => {
    if (!phone)
        throw new common_1.BadRequestException('전화번호는 필수 입력값입니다.');
    // 숫자만(10~11자리) 예시. 원하면 한국 휴대폰 규칙(01X)으로 강화 가능
    if (!/^\d{10,11}$/.test(phone)) {
        throw new common_1.BadRequestException('올바른 전화번호 형식이 아닙니다.');
    }
};
exports.validatePhoneNumber = validatePhoneNumber;
const validateAuthCode = (zip) => {
    if (!zip)
        throw new common_1.BadRequestException('인증코드는 필수 입력값입니다.');
    if (!/^\d{6}$/.test(zip)) {
        throw new common_1.BadRequestException('인증코드는 숫자 6자리여야 합니다.');
    }
};
exports.validateAuthCode = validateAuthCode;
const validateStringBasic = (txt, label) => {
    if (!txt)
        throw new common_1.BadRequestException(`${label}은 필수 입력값입니다.`);
};
exports.validateStringBasic = validateStringBasic;
//# sourceMappingURL=validate.js.map