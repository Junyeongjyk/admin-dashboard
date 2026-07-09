import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { recoverIdentityRequestDto } from "../dto/auth-recover-identity.dto";
import { validateName, validatePhoneNumber } from "../../common/functions/validate";

@Injectable()
export class DecryptAndValidateRecoverIdentityPipe implements PipeTransform {
    
    transform(dto: recoverIdentityRequestDto): recoverIdentityRequestDto {
        const plainName = getDecryptData(dto.name, '이름');
        const plainPhoneNumber = getDecryptData(dto.phoneNumber, '전화번호');

        validateName(plainName);
        validatePhoneNumber(plainPhoneNumber);

        dto.plainName = plainName
        dto.plainPhoneNumber = plainPhoneNumber

        return dto
    }
}

