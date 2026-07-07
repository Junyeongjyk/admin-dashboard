import { Injectable, PipeTransform } from "@nestjs/common";
import { SignupRequestDto } from "../dto/auth-signup.dto";
import { getDecryptData } from "../../common/functions/aes.util";
import { validateAddress, validateIdentity, validateName, validatePassword, validatePhoneNumber, validateZipCode } from "../../common/functions/validate";
import { SigninRequestDto } from "../dto/auth-signin.dto";


@Injectable()
export class DecryptAndValidateSigninPipe implements PipeTransform {

    transform(dto: SigninRequestDto): SigninRequestDto {

        const plainIdentity = getDecryptData(dto.identity, '이메일');
        const plainPassword = getDecryptData(dto.password, '비밀번호');

        dto.plainIdentity = plainIdentity
        dto.plainPassword = plainPassword

        return dto
    }

}