import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UsersDeleteMeDto {

    @ApiProperty({
        description: '접속 디바이스Id',
        example: 'WEB_1234', 
        required: true,
    })
    @IsString()
    deviceId: string;

}