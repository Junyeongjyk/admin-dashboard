import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { DecryptAndValidateSignupPipe } from "./pipes/auth.signup.pipe";
import { AuthService } from "./auth.service";
import { DecryptAndValidateCheckIdentityPipe } from "./pipes/auth-check-identity.pipe";
import { DecryptAndValidateRecoverIdentityPipe } from "./pipes/auth-recover-identity.pipe";
import { DecryptAndValidateResetPasswordComfirmPipe } from "./pipes/auth.reset-password-comfirm.pipe";
import { PartnerModule } from "../partner/partner.module";
import { JwtModule } from "@nestjs/jwt";
import { Sign } from "../common/sign.helper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { PartnerProfiles } from "../partner/entity/partner-profiles.entity";
import { HttpModule } from "@nestjs/axios";
import { MqttModule } from "../mqtt/mqtt.module";
import { SessionStore } from "../common/store/session.store";

@Module({
    imports: [
        UserModule,
        PartnerModule,
        MqttModule,
        TypeOrmModule.forFeature([
            User, PartnerProfiles
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }),
        HttpModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        SessionStore,
        DecryptAndValidateSignupPipe,
        DecryptAndValidateCheckIdentityPipe,
        DecryptAndValidateRecoverIdentityPipe,
        DecryptAndValidateResetPasswordComfirmPipe,
        Sign,
    ],
    exports: [
        AuthService
    ]
})

export class AuthModule {}