
import { Module } from "@nestjs/common";
import { FaqsService } from "./faqs.service";
import { FaqsController } from "./faqs.controller";
import { FaqsRepository } from "./faqs.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { Faqs } from "./entity/faqs.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, Faqs
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }),  
    ],
    controllers:[FaqsController],
    providers: [FaqsService, FaqsRepository],
    exports: [FaqsService, FaqsRepository]
})
export class FaqsModule {}