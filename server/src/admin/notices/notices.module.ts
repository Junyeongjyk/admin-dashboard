import { Module } from "@nestjs/common";
import { NoticesController } from "./notices.controller";
import { NoticesService } from "./notices.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../../user/entity/users.entity";
import { NoticesRepository } from "./notices.repository";
import { Notices } from "../../notices/entity/notices.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([
                    User,Notices
                ]),
    ],
    controllers:[NoticesController],
    providers: [NoticesService, NoticesRepository],
    exports: [NoticesService, NoticesRepository]
})
export class NoticesModule {}