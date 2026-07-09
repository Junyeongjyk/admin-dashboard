import { ApiProperty } from "@nestjs/swagger";

export class RecoverIdentityResponseDto {
    @ApiProperty({
        description: '마스킹 적용된 사용자 아이디', 
        example: 'te***@***.com',
        required:true, 
    })
    identity: string

}