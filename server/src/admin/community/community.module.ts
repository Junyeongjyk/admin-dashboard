
import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../../user/entity/users.entity";
import { CommunityPost } from "../../community/entity/community-posts.entity";
import { CommunityComment } from "../../community/entity/community-comments.entity";
import { CommunityRepository } from "./community.repository";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            User,
            CommunityComment,
            CommunityPost
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