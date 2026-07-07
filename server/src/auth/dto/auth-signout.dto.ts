import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SignupPath } from "../../common/enum/users.enum";

export class SignoutRequestDto {

    @ApiProperty({
        description: '모바일 App 로그인시 App에대한 uuid',
        example: '1233-1234-1234-1234',
    }) 
    @IsString()
    @IsOptional()
    uuid: string;

    @ApiProperty({
        description: '접속 디바이스Id',
        example: 'WEB_1234', 
        required: true,
    })
    @IsString()
    deviceId: string;
}