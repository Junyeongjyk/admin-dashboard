
import { Module } from "@nestjs/common";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from "./log.repository";
import { UserAuthHistories } from "../../user/entity/user-auth-histories.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAuthHistories]), 
    ],
    controllers:[LogController],
    providers: [LogService, LogRepository],
    exports: [LogService, LogRepository]
})
export class LogModule {}