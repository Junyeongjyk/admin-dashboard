
import { Module } from "@nestjs/common";
import { FaqsService } from "./faqs.service";
import { FaqsController } from "./faqs.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqsRepository } from "./faqs.repository";
import { Faqs } from "../../faqs/entity/faqs.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            Faqs
        ]), 
    ],
    controllers:[FaqsController],
    providers: [FaqsService, FaqsRepository],
    exports: [FaqsService, FaqsRepository]
})
export class FaqsModule {}