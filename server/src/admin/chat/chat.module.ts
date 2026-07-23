import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../../user/entity/user.entity";
import { ChatRepository } from "./chat.repository";
import { ChatBannedWord } from "../../chat/entity/chat-banned-words.entity";
import { ChatRoom } from "../../chat/entity/chat-rooms.entity";
import { ChatMessage } from "../../chat/entity/chat-messages.entity";
import { MqttModule } from "../../mqtt/mqtt.module";


@Module({
    imports: [
        MqttModule,
        TypeOrmModule.forFeature([
            User, ChatBannedWord, ChatRoom, ChatMessage
        ]),
    ],
    controllers:[ChatController],
    providers: [ChatService, ChatRepository],
    exports: [ChatService, ChatRepository]
})
export class ChatModule {}