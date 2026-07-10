import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { handleSend, log } from "../config/log.tools.config";
import { ChatUserRepository } from "./chat.repository";
import { ChatListDataItem } from "./dto/data/chat-list-data.dto";
import { UserType } from "../common/enum/user.enum";
import { UserRepository } from "../user/user.repository";
import { ChatUserBasicRequestDto } from "./dto/chat-basic.dto";
import { ChatMassgeDataResponseDto, ChatMessageDataItem } from "./dto/data/chat-message-list-data.dto";
import { ChatUserSendRequestDto } from "./dto/chat-send.dto.";
import { ChatRoom } from "./entity/chat-rooms.entity";
import { ChatMessage } from "./entity/chat-messages.entity";
import { ChatSendResponseDto } from "./dto/data/chat-send-data.dto";
import dayjs = require("dayjs");
import { User } from "../user/entity/user.entity";
import { buildEnvelope } from "../mqtt/function/envelope.builder";
import { EventType } from "../mqtt/types/event.types";
import { REALTIME_TOPIC } from "../mqtt/types/mqtt.constants";
import { MqttPublisherService } from "../mqtt/mqtt.service";
import { ChatUserMessageReadRequestDto } from "./dto/chat-mesage-read.dto";
import { saveUploadedFile } from "../common/functions/file-save.util";
import { FilePath } from "../common/enum/common.enum";
import { Response  } from 'express';
import * as fs from 'fs/promises';
import { createReadStream } from "fs";

@Injectable()
export class ChatUserService {

    constructor(
        private readonly chatRepository: ChatUserRepository,
        private readonly userRepository: UserRepository,
        private readonly mqttPublisherService: MqttPublisherService,
    ) {}

    async getList(token:any) {
        try {

            let items:ChatListDataItem[] = []                            

            if (token.type === UserType.USER) {
                items = await this.chatRepository.getUserRooms(token.id)
            } else {
                items = await this.chatRepository.getPartnerChatRoom(token.id)
            }

            return handleSend({items})

        } catch (error) {
            log('[ChatUserService] getList',  '탄정/유저 채팅 상대방 리스트 조회 에러', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('탄정/유저 채팅 상대방 리스트 조회 오류가 발생했습니다.')
        }
    }

    async getMessageList(dto: ChatUserBasicRequestDto, token:any) {
        try {

            let messageList: ChatMessageDataItem[] = []
            let chatData:ChatMassgeDataResponseDto = new ChatMassgeDataResponseDto();
            let roomInfo: ChatRoom | null;

            if (token.type == UserType.USER) {

                const partnerInfo = await this.userRepository.findByIdInfo(dto.chatRoomId)
                if (!partnerInfo) {
                    throw new NotFoundException('탐정이 존재하지 않습니다.')
                }

                roomInfo =  await this.chatRepository.findUserRoomInfo(token.id, dto.chatRoomId)
                if (roomInfo) {
                    messageList = await this.chatRepository.findChatMessages(roomInfo.id)
                    chatData.roomId = roomInfo.id
                }                

                chatData.name = partnerInfo.name
                chatData.roomId = roomInfo ? roomInfo.id : null
    
            } else {
                roomInfo =  await this.chatRepository.findByIdChatRoom(dto.chatRoomId)
                if (!roomInfo) {
                    throw new NotFoundException('상담 룸이 존재하지 않습니다.')
                }

                const userInfo = await this.userRepository.findByIdInfo(roomInfo.participantAId)
                if (!userInfo) {
                    throw new NotFoundException('의뢰인이 존재하지 않습니다.')
                }
            
                chatData.name = userInfo.name
                chatData.roomId = roomInfo.id 
                
                messageList = await this.chatRepository.findChatMessages(dto.chatRoomId)
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

    async getAdminMessageList(token:any) {
        try {

            const roomInfo = await this.chatRepository.findByUserIdAdminRoom(token.id)
            let messageList: ChatMessageDataItem[] = []
            let chatData:ChatMassgeDataResponseDto = new ChatMassgeDataResponseDto();

            if (roomInfo) {
                messageList = await this.chatRepository.findChatMessages(roomInfo.id)
                chatData.roomId = roomInfo.id
            }

            chatData.items = messageList

            return handleSend(chatData)

        } catch (error) {
            log('[ChatUserService] getAdminMessageList',  '관리자 채팅 메세지 내역 에러', error)

            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('관리자 채팅 메세지 내역 조회 오류가 발생했습니다.')
        }
    }

    async sendMessage(
        dto: ChatUserSendRequestDto,  
        token:any, 
        chatFile?: Express.Multer.File
    ) {
        try {

            let roomInfo:ChatRoom | null; 
            if (!dto.roomId) {
                
                let fromInfo: User | null = null
                if (dto.type == 0) {
                    fromInfo = await this.userRepository.findByIdInfo(dto.fromId!)
                    if (!fromInfo) {
                        throw new NotFoundException('상대방이 존재하지 않습니다.')
                    }
                }
                
                const chatRoom = new ChatRoom()
                chatRoom.participantAId = token.id
                chatRoom.participantARole = token.type
                if (dto.type == 0) {
                    chatRoom.participantBId = fromInfo!.id
                    chatRoom.participantBRole = fromInfo!.userType
                } else {
                    chatRoom.participantBId = null
                    chatRoom.participantBRole = UserType.ADMIN
                }
                
                chatRoom.status = 'OPEN'
            
                roomInfo = await this.chatRepository.saveChatRoom(chatRoom)
            } else {
                roomInfo = await this.chatRepository.findByIdChatRoom(dto.roomId)
            }


            if (!roomInfo) {
                throw new NotFoundException('상담가능한 채팅이 압니다.')
            } else if (roomInfo.status !== 'OPEN') {
                throw new BadRequestException('상담 할수 없는 채팅입니다.')
            }

            let fromUser:User | null;
            if (dto.type == 0) {
                if (token.type == UserType.USER) {
                    fromUser = await this.userRepository.findByIdInfo(roomInfo.participantBId!)
                } else {
                    fromUser = await this.userRepository.findByIdInfo(roomInfo.participantAId)
                }

                if (!fromUser) {
                    throw new NotFoundException('상대방이 존재하지 않습니다.')
                }
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
            const sendData = new ChatSendResponseDto()
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
                scope: { role: dto.type == 0  ? fromUser!.userType : UserType.ADMIN, user_id: `${ dto.type == 0 ? fromUser!.id : 0}` },
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

    async readMessage(dto: ChatUserMessageReadRequestDto, token:any) {
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

    async getImage(id:number, res: Response) {
        try {
            
            const messageInfo = await this.chatRepository.findByIdMessage(id)
            if (!messageInfo) {
                throw new NotFoundException('메세지가 존재하지 않습니다.')
            }
            
            const buf = await fs.readFile(messageInfo.content!)
            res.setHeader('Content-Type', messageInfo.mimeType!);
            return res.send(buf);
            
        } catch (error) {
            log('[ChatUserService] getImage',  '채팅 상담관련 이미지 호출중 에러가  발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('상담관련 이미지 호출 중 에서 발생했습니다.')
        }
    }

    async chatDownload(id:number) {
        try {
            
            const messageInfo = await this.chatRepository.findByIdMessage(id)
            if (!messageInfo) {
                throw new NotFoundException('메세지가 존재하지 않습니다.')
            }

            if (!messageInfo.chatContentType) {
                throw new ForbiddenException('다운로드 할수 없습니다.')
            }

            return {
                stream: createReadStream(messageInfo.content!),
                originalName: messageInfo.originalName,
                mimeType: messageInfo.mimeType,
                size: messageInfo.size
            };

            
        } catch (error) {
            log('[ChatUserService] getImage',  '채팅 상담관련 파일 다운로드 중 에러가  발생했습니다.', error)
    
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('상담관련 파일다운로드 중 에서 발생했습니다.')
        }
    }
}