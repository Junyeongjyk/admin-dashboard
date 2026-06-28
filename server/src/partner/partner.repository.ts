import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartnerCertification } from "./entity/partner-certifications.entity";
import { PartnerProfiles } from "./entity/partner-profiles.entity";
import { PartnerMatch } from "./entity/partner-match.entity";
import { PartnerLocationLog } from "./entity/partner-location-logs.entity";

@Injectable()
export class PartnerRepository {

    constructor(
        @InjectRepository(PartnerProfiles)
        private readonly partnerProfilesRepository: Repository<PartnerProfiles>,
        @InjectRepository(PartnerCertification)
        private readonly partnerCertificationRepository: Repository<PartnerCertification>,
        @InjectRepository(PartnerMatch)
        private readonly partnerMatchRepository: Repository<PartnerMatch>,
        @InjectRepository(PartnerLocationLog)
        private readonly partnerLocationLogRepository: Repository<PartnerLocationLog>        
    ) {}
    
    async savePartnerProfiles(partnerProfiles: PartnerProfiles): Promise<PartnerProfiles> {
        return await this.partnerProfilesRepository.save(partnerProfiles);
    }
    
    async findByUserid(userId: number): Promise<PartnerProfiles | null> {
        return  await this.partnerProfilesRepository.createQueryBuilder('profile')
                        .where('profile.userId = :userId', {userId})
                        .getOne()
    }

    async findById(id:number): Promise<PartnerProfiles | null> {
        return  await this.partnerProfilesRepository.createQueryBuilder('profile')
                        .where('profile.id = :id', {id})
                        .getOne()
    }

}