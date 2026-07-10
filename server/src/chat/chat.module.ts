import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { PartnerProfiles } from "../partner/entity/partner-profiles.entity";
import { JwtModule } from "@nestjs/jwt";
import { ChatClientController } from "./chat.controller";
import { ChatClientService } from "./chat.service";
import { ChatClientRepository } from "./chat.repository";
import { UserModule } from "../user/user.module";
import { ChatRoom } from "./entity/chat-rooms.entity";
import { ChatMessage } from "./entity/chat-messages.entity";
import { MqttModule } from "../mqtt/mqtt.module";

@Module({
    imports: [
        UserModule,
        MqttModule,
        TypeOrmModule.forFeature([
            User, PartnerProfiles, ChatRoom, ChatMessage
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES ?? '86400')
            }
        }), 
    ],
    controllers:[ChatClientController],
    providers: [
        ChatClientService,
        ChatClientRepository
    ],
    exports: [
        ChatClientService,
        ChatClientRepository
    ]
})
export class ChatClientModule {}