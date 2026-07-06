
import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { CommunityPost } from "./entity/community-posts.entity";
import { CommunityRepository } from "./community.repository";
import { JwtModule } from "@nestjs/jwt";
import { CommunityComment } from "./entity/community-comments.entity";
import { PartnerProfilesProfiles } from "../partner/entity/partner-profiles.entity";
import { Banner } from "../admin/system/entity/banner.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, PartnerProfilesProfiles, CommunityPost, CommunityComment,
            Banner
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }), 
    ],
    controllers:[CommunityController],
    providers: [CommunityService, CommunityRepository],
    exports: [CommunityService, CommunityRepository]
})
export class CommunityModule {}