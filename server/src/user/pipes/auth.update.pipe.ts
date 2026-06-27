import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { validateAddress, validateEmail, validatePhoneNumber, validateZipCode } from "../../common/functions/validate";
import { UserUpdateRequestDto } from "../dto/users-update.dto";


@Injectable()
export class DecryptAndValidateUpdatePipe implements PipeTransform {

    transform(dto: UserUpdateRequestDto): UserUpdateRequestDto {


        const plainEmail = getDecryptData(dto.email, '주소');
        const plainAddress = getDecryptData(dto.address, '주소');
        const plainZipCode = getDecryptData(dto.zipCode, '우편번호');
        const plainPhone = getDecryptData(dto.phone, '우편번호');

        validateEmail(plainEmail)
        validateAddress(plainAddress);
        validateZipCode(plainZipCode);
        validatePhoneNumber(plainPhone)

        dto.plainAddress = plainAddress
        dto.plainZipCode = plainZipCode
        dto.plainEmail = plainEmail
        dto.plainPhone = plainPhone

        return dto
    }

}