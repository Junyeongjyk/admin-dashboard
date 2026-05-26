import { BadRequestException, createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { UserType } from "./enum/users.enum";

export const Token = createParamDecorator((data: string | String[], ctx: ExecutionContext): object => {

    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies['access-token'];

    if (!token) {
        throw new BadRequestException('유효하지 않는 접근입니다. 토큰이 없습니다.');
    } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as jwt.JwtPayload;
        
        if (!data) {
            new BadRequestException('유효하지 않는 접근입니다. 데이터가 없습니다.');        
        } else {
            if (data.includes(decoded.type)) {
                return decoded
            }
        }

        throw new BadRequestException('유효하지 않는 접근입니다.');        
    }

})