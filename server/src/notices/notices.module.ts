
import { Module } from "@nestjs/common";
import { NoticesController } from "./notices.controller";
import { NoticesService } from "./notices.service";
import { NoticesRepository } from "./notices.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notices } from "./entity/notices.entity";
import { JwtModule } from "@nestjs/jwt";
import { User } from "../user/entity/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Notices, User
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }),  
    ],
    controllers:[NoticesController],
    providers: [NoticesService, NoticesRepository],
    exports: [NoticesService, NoticesRepository]
})
export class NoticesModule {}