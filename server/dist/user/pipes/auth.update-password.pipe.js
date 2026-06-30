"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptAndValidateUpdatePasswordPipe = void 0;
const common_1 = require("@nestjs/common");
const aes_util_1 = require("../../common/functions/aes.util");
const validate_1 = require("../../common/functions/validate");
let DecryptAndValidateUpdatePasswordPipe = class DecryptAndValidateUpdatePasswordPipe {
    transform(dto) {
        const plainIdentity = (0, aes_util_1.getDecryptData)(dto.identity, '이메일');
        const plainPassword = (0, aes_util_1.getDecryptData)(dto.password, '비밀번호');
        (0, validate_1.validateIdentity)(plainIdentity);
        (0, validate_1.validatePassword)(plainPassword);
        dto.plainIdentity = plainIdentity;
        dto.plainPassword = plainPassword;
        return dto;
    }
};
exports.DecryptAndValidateUpdatePasswordPipe = DecryptAndValidateUpdatePasswordPipe;
exports.DecryptAndValidateUpdatePasswordPipe = DecryptAndValidateUpdatePasswordPipe = __decorate([
    (0, common_1.Injectable)()
], DecryptAndValidateUpdatePasswordPipe);
//# sourceMappingURL=auth.update-password.pipe.js.map