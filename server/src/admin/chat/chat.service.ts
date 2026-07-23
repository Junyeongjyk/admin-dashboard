import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { handleSend, log } from "../../config/log.tools.config";
import { ChatRepository } from "./chat.repository";
import { ChatBasicRequestDto } from "./dto/chat-basic.dto";
import { ChatAdminMassgeDataResponseDto, ChatAdminMessageDataItem } from "./dto/data/chat-message-list-data.dto";
import { ChatRoom } from "../../chat/entity/chat-rooms.entity";
import { UserType } from "../../common/enum/user.enum";
import { ChatSendRequestDto } from "./dto/chat-send.dto";
import { ChatMessage } from "../../chat/entity/chat-messages.entity";
import { ChatAdminSendResponseDto } from "./dto/data/chat-send-data.dto";
import dayjs = require("dayjs");
import { buildEnvelope } from "../../mqtt/function/envelope.builder";
import { EventType } from "../../mqtt/types/event.types";
import { MqttPublisherService } from "../../mqtt/mqtt.service";
import { REALTIME_TOPIC } from "../../mqtt/types/mqtt.constants";
import { ChatMessageReadRequestDto } from "./dto/chat-mesage-read.dto";
import { saveUploadedFile } from "../../common/functions/file-save.util";
import { FilePath } from "../../common/enum/common.enum";
@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly mqttPublisherService: MqttPublisherService,
    ) {}
    async getList(dto: any, token:any) {
        try {
        
            const { type, size, page, q } = dto

            const result = await this.chatRepository.getList(page, size, type, q)
            return handleSend(result)
            
        } catch (error) {
            log('[ChatService] getList',  '관리자 - 채팅 리스트 오류', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 채팅 리스트 오류')
        }
    }
    
    async getMessageList(dto: ChatBasicRequestDto, token:any) {
        try {

            
            let chatData:ChatAdminMassgeDataResponseDto = new ChatAdminMassgeDataResponseDto();
            const roomInfo = await this.chatRepository.findByIdChatRoom(dto.chatRoomId)

            if (!roomInfo) {
                throw new NotFoundException('상담 룸이 존재하지 않습니다.')
            }

            chatData.roomId = roomInfo.id
            const messageList = await this.chatRepository.findChatMessages(  
                dto.chatRoomId,
                token.id 
            )
          
            const UserInfo = await this.chatRepository.findByIdInfo(roomInfo.participantAId)
            if (UserInfo) {
                chatData.name = UserInfo.name
                chatData.userType = UserInfo.userType
            }

            chatData.items = messageList
            await this.chatRepository.updateMessageRead(roomInfo!.id, token.id)

            return handleSend(chatData)

        } catch (error) {
            log('[ChatUserService] getMessageList',  '탄정/유저 채팅 메세지 내역 에러', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('탄정/유저 채팅 메세지 내역 조회 오류가 발생했습니다.')
        }
    }
    

    async bannedWordList(dto: any) {
        try {
        
            const result = await this.chatRepository.bannedWordList(dto)
            return handleSend(result)
            
        } catch (error) {
            log('[ChatService] bannedWordList',  '관리자 - 금지단어 리스트 오류.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 금지단어 리스트 오류')
        }
    }

    async bannedWordCreate(dto: any, token:any) {
        try {
        
            const result = await this.chatRepository.bannedWordCreate(dto, token)
            return handleSend(result)
            
        } catch (error) {
            log('[ChatService] bannedWordCreate',  '관리자 - 금지단어 등록 실패.', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 금지단어 등록 실패')
        }
    }
    async bannedWordDelete(dto: any) {
        try {
            const result = await this.chatRepository.bannedWordDelete(dto)
            return handleSend(result)
            
        } catch (error) {
            log('[ChatService] bannedWordDelete',  '관리자 - 금지단어 삭제 실패.', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 - 금지단어 삭제 실패')
        }
    }

    async sendMessage(
        dto: ChatSendRequestDto,  
        token:any, 
        chatFile?: Express.Multer.File
    ) {
        try {

            const roomInfo = await this.chatRepository.findByIdChatRoom(dto.roomId)

            if (!roomInfo) {
                throw new NotFoundException('상담가능한 채팅이 압니다.')
            } else if (roomInfo.status !== 'OPEN') {
                throw new BadRequestException('상담 할수 없는 채팅입니다.')
            }

            const fromUser = await this.chatRepository.findByIdInfo(roomInfo.participantAId)
            if (!fromUser) {
                throw new NotFoundException('상대방이 존재하지 않습니다.')
            }

            const message = new ChatMessage()
            message.chatRoomId = roomInfo.id
            message.senderId = token.id
            message.content = dto.content
            message.messageType = ''
            
            if (chatFile) {
                const chatFileSaved = saveUploadedFile(chatFile, `${FilePath.MESSAGE}/${roomInfo.id}`)
                message.content = chatFileSaved.savedPath
                message.originalName = chatFileSaved.originalName
                message.mimeType = chatFileSaved.mimeType
                message.chatContentType = true
            }

            const messageInfo = await this.chatRepository.saveChatMessage(message);
            const sendData = new ChatAdminSendResponseDto()
            sendData.roomId = roomInfo.id
            sendData.id = messageInfo.id
            sendData.senderId = messageInfo.senderId
            sendData.content = messageInfo.content ?? ''
            sendData.originalName = messageInfo.originalName
            sendData.mimeType = messageInfo.mimeType
            sendData.size = messageInfo.size
            sendData.chatContentType = messageInfo.chatContentType
    
            sendData.createdAt = dayjs(messageInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')
            
            const envelope = buildEnvelope({
                event_type: EventType.CHAT_MESSAGE_CREATE,
                scope: { role: fromUser!.userType, user_id: `${ fromUser!.id }` },
                payload: sendData,
            });

            this.mqttPublisherService.publish(REALTIME_TOPIC, envelope)

            return handleSend(sendData)

        } catch (error) {
            log('[ChatUserService] sendMessage',  '탄정/유저 채팅 메세지 전송 에러', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('탄정/유저 채팅 메세지 전송 오류가 발생했습니다.')
        }
    }

    async readMessage(dto: ChatMessageReadRequestDto, token:any) {
        try {

            await this.chatRepository.updateSendMessageRead(dto.messageId)

            return handleSend()
        } catch (error) {
            log('[ChatUserService] readMessage',  '메세지 읽음여부 에러', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('상탐 메세지 읽음여부 처리 에러가 발생했습니다.')
        }
    }

}