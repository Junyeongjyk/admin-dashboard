import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UserRepository } from "./user.repository";
import { PartnerModule } from "../partner/partner.module";
import { UserController } from "./user.controller";
import { UserAuthHistories } from "./entity/user-auth-histories.entity";
import { JwtModule } from "@nestjs/jwt";
import { DecryptAndValidateUpdatePipe } from "./pipes/auth.update.pipe";
import { DecryptAndValidateUpdatePasswordPipe } from "./pipes/auth.update-password.pipe";
import { PartnerProfiles } from "../partner/entity/partner-profiles.entity";
import { MqttModule } from "../mqtt/mqtt.module";
import { Sign } from "../common/sign.helper";

@Module({
    imports: [
        PartnerModule,
        MqttModule,
        TypeOrmModule.forFeature([
            User, UserAuthHistories, PartnerProfiles
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }), 
    ],
    controllers: [UserController],
    providers: [
        UserService, UserRepository,
        DecryptAndValidateUpdatePipe,
        DecryptAndValidateUpdatePasswordPipe,
        Sign
    ],
    exports: [UserService, UserRepository]
})
export class UserModule {}