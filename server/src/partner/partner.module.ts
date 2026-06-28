import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartnerRepository } from "./partner.repository";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { JwtModule } from "@nestjs/jwt";
import { PartnerCertification } from "./entity/partner-certifications.entity";
import { PartnerProfiles } from "./entity/partner-profiles.entity";
import { PartnerMatch } from "./entity/partner-match.entity";
import { PartnerLocationLog } from "./entity/partner-location-logs.entity";
import { MqttModule } from "../mqtt/mqtt.module";

@Module({
    imports: [
        MqttModule,
        TypeOrmModule.forFeature([
            PartnerProfiles, PartnerCertification, PartnerMatch,
            PartnerLocationLog
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }), 
    ],
    controllers: [PartnerController],
    providers: [PartnerRepository, PartnerService],
    exports: [PartnerRepository, PartnerService]
})
export class PartnerModule {}