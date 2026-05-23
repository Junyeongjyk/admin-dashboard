import { Injectable } from "@nestjs/common";

@Injectable()
export class Sign {
  
    async in (res: any, accessToken: string) {
        await res.cookie("access-token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
            maxAge: parseInt(process.env["JWT_EXPIRES"] ?? "3600") * 1000 + (3600000 * 9)
        })
    }

    async out(res:any) {
        await res.cookie("access-token", null, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
            maxAge: 0
        });
    }

}