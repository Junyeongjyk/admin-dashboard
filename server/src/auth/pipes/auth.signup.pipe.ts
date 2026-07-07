import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { validateAddress, validateIdentity, validateName, validatePassword, validatePhoneNumber, validateStringBasic, validateZipCode } from "../../common/functions/validate";
import { SignupRequestDto } from "../dto/auth-signup.dto";


@Injectable()
export class DecryptAndValidateSignupPipe implements PipeTransform {

    transform(dto: SignupRequestDto): SignupRequestDto {
        const plainIdentity = getDecryptData(dto.identity, '이메일');
        const plainPassword = getDecryptData(dto.password, '비밀번호');
        const plainName = getDecryptData(dto.name, '이름');
        const plainAddress = getDecryptData(dto.address, '주소');
        const plainDetailAddress = getDecryptData(dto.detailAddress, '상세주소');
        const plainZipCode = getDecryptData(dto.zipCode, '우편번호');
        const plainPhoneNumber = getDecryptData(dto.phoneNumber, '전화번호');

        validateIdentity(plainIdentity);
        validatePassword(plainPassword);
        validateName(plainName);
        validateAddress(plainAddress);
        validateStringBasic(plainDetailAddress, '상세주소')
        validateZipCode(plainZipCode);
        validatePhoneNumber(plainPhoneNumber);
        
        dto.plainIdentity = plainIdentity
        dto.plainPassword = plainPassword
        dto.plainName = plainName
        dto.plainAddress = plainAddress
        dto.plainDetailAddress = plainDetailAddress
        dto.plainZipCode = plainZipCode
        dto.plainPhoneNumber = plainPhoneNumber

        return dto

    }

}