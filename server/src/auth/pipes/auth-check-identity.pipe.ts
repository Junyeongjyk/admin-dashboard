import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { CheckIdentityRequestDto } from "../dto/auth-check-identity.dto";
import { validateIdentity, validatePhoneNumber } from "../../common/functions/validate";

@Injectable()
export class DecryptAndValidateCheckIdentityPipe implements PipeTransform {
    
    transform(dto: CheckIdentityRequestDto): CheckIdentityRequestDto {

        const plainIdentity = getDecryptData(dto.identity, '이메일');
        let plainPhoneNumber = '';
        if (dto.phoneNumber) {
            plainPhoneNumber = getDecryptData(dto.phoneNumber, '전화번호');
        }

        validateIdentity(plainIdentity);
        if (plainPhoneNumber !== '') {
            validatePhoneNumber(plainPhoneNumber);
        }
        
        dto.plainIdentity = plainIdentity
        dto.plainPhoneNumber = plainPhoneNumber

        return dto
    }
}

