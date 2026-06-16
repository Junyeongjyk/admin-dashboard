
import { Module } from "@nestjs/common";
import { PartnersController } from "./partner.controller";
import { PartnersService } from "./partner.service";
import { PartnersRepository } from "./partner.repository";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../user/entity/users.entity';
import { PartnerProfiles } from "../../partner/entity/partner-profiles.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, PartnerProfiles]), 
    ],
    controllers:[PartnersController],
    providers: [PartnersService, PartnersRepository],
    exports: [PartnersService, PartnersRepository]
})
export class PartnerModule {}