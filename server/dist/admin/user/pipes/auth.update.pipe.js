"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptAndValidateUpdatePipe = void 0;
const common_1 = require("@nestjs/common");
const aes_util_1 = require("../../common/functions/aes.util");
const validate_1 = require("../../common/functions/validate");
let DecryptAndValidateUpdatePipe = class DecryptAndValidateUpdatePipe {
    transform(dto) {
        const plainEmail = (0, aes_util_1.getDecryptData)(dto.email, '주소');
        const plainAddress = (0, aes_util_1.getDecryptData)(dto.address, '주소');
        const plainZipCode = (0, aes_util_1.getDecryptData)(dto.zipCode, '우편번호');
        const plainPhone = (0, aes_util_1.getDecryptData)(dto.phone, '우편번호');
        (0, validate_1.validateEmail)(plainEmail);
        (0, validate_1.validateAddress)(plainAddress);
        (0, validate_1.validateZipCode)(plainZipCode);
        (0, validate_1.validatePhoneNumber)(plainPhone);
        dto.plainAddress = plainAddress;
        dto.plainZipCode = plainZipCode;
        dto.plainEmail = plainEmail;
        dto.plainPhone = plainPhone;
        return dto;
    }
};
exports.DecryptAndValidateUpdatePipe = DecryptAndValidateUpdatePipe;
exports.DecryptAndValidateUpdatePipe = DecryptAndValidateUpdatePipe = __decorate([
    (0, common_1.Injectable)()
], DecryptAndValidateUpdatePipe);
//# sourceMappingURL=auth.update.pipe.js.map