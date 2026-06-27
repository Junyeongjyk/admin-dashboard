
import { Module } from "@nestjs/common";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { PartnerRepository } from "./partner.repository";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entity/users.entity';
import { PartnerProfiles } from "../../partner/entity/partner-profiles.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, PartnerProfiles]), 
    ],
    controllers:[PartnerController],
    providers: [PartnerService, PartnerRepository],
    exports: [PartnerService, PartnerRepository]
})
export class PartnerModule {}