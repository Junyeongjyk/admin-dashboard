import { Injectable, PipeTransform } from "@nestjs/common";
import { getDecryptData } from "../../common/functions/aes.util";
import { validateIdentity, validatePassword } from "../../common/functions/validate";
import { UserUpdatePasswordRequestDto } from "../dto/users-update-password.dto";


@Injectable()
export class DecryptAndValidateUpdatePasswordPipe implements PipeTransform {

    transform(dto: UserUpdatePasswordRequestDto): UserUpdatePasswordRequestDto {

        const plainIdentity = getDecryptData(dto.identity, '이메일');
        const plainPassword = getDecryptData(dto.password, '비밀번호');

        validateIdentity(plainIdentity);
        validatePassword(plainPassword);
        
        dto.plainIdentity = plainIdentity
        dto.plainPassword = plainPassword

        return dto
    }

}