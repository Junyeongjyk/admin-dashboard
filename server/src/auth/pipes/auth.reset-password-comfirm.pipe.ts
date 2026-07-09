import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { validateAuthCode, validateIdentity, validatePassword, validatePhoneNumber } from "../../common/functions/validate";
import { ResetPasswordComfirmRequestDto } from "../dto/auth-reset-password-comfirm.dto";


@Injectable()
export class DecryptAndValidateResetPasswordComfirmPipe implements PipeTransform {

    transform(dto: ResetPasswordComfirmRequestDto): ResetPasswordComfirmRequestDto {
        const plainIdentity = getDecryptData(dto.identity, '이메일');
        const plainPassword = getDecryptData(dto.password, '비밀번호');

        validateIdentity(plainIdentity);
        validatePassword(plainPassword);

        dto.plainIdentity = plainIdentity
        dto.plainPassword = plainPassword
        
        return dto;
    }

}