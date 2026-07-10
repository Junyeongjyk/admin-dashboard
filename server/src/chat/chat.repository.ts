import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatListDataItem } from "./dto/data/chat-list-data.dto";
import { ChatRoom } from "./entity/chat-rooms.entity";
import { ChatMessageDataItem } from "./dto/data/chat-message-list-data.dto";
import { ChatMessage } from "./entity/chat-messages.entity";
import { UserType } from "../common/enum/user.enum";

@Injectable()
export class ChatUserRepository {

    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepository: Repository<ChatMessage>,
    ) {}

    async saveChatRoom(chatRoom: ChatRoom): Promise<ChatRoom> {
        return await this.chatRoomRepository.save(chatRoom)
    }

    async saveChatMessage(chatMessage: ChatMessage): Promise<ChatMessage> {
        return await this.chatMessageRepository.save(chatMessage)
    }

    async findByIdChatRoom(roomId:number): Promise<ChatRoom | null> {
        return await this.chatRoomRepository.createQueryBuilder('cr')
                        .where('cr.id = :roomId', {roomId})
                        .getOne()
    }

    async findByIdMessage(id:number): Promise<ChatMessage | null> {
        return await this.chatMessageRepository.createQueryBuilder('msg')
                    .where('msg.id = :id', {id})
                    .getOne()
    }

    async findByUserIdAdminRoom(userId: number): Promise<ChatRoom | null> {
        return  await this.chatRoomRepository
                .createQueryBuilder('room')
                .where('room.participant_a_id = :userId', { userId })
                .andWhere('room.participant_b_role = :role', { role: UserType.ADMIN })
                .andWhere('room.status = :status', { status: 'OPEN' })
                .getOne()
    }

    async getUserRooms(userId: number): Promise<any[]> {
        return await this.partnerMatchRepository
            .createQueryBuilder('dm')
            .innerJoin('dm.request', 'r')
            .innerJoin('dm.partner', 'dp')
            .innerJoin('dp.user', 'u')

            .leftJoin(
                ChatRoom,
                'cr',
                'cr.participant_a_id = :userId AND cr.participant_b_id = u.id AND cr.status = :roomStatus',
                { userId, roomStatus: 'OPEN' }
            )

            // 마지막 메시지
            .leftJoin(
                'chat_messages',
                'last_cm',
                'last_cm.chat_room_id = cr.id AND last_cm.is_deleted = false'
            )

            //unread 
            .leftJoin(
                'chat_messages',
                'unread_cm',
                `unread_cm.chat_room_id = cr.id 
                AND unread_cm.sender_id <> :userId
                AND unread_cm.is_read = false
                AND unread_cm.is_deleted = false`
            )

            .select([
                'u.id::int AS id',
                'u.name AS name',
                'dp.nickname AS nickname',
                'dp.region AS region',
                'dp.careerYears AS "careerYears"',
                'dp.introduction AS introduction',
                'dp.ratingAvg AS "ratingAvg"',

                'cr.id AS "roomId"',

                // 마지막 메시지
                'last_cm.content AS "lastMessage"',
                `TO_CHAR(last_cm.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "lastMessageAt"`,

                // unread count
                'COUNT(DISTINCT unread_cm.id)::int AS "unreadCount"'
            ])

            .where('r.user_id = :userId', { userId })
            .andWhere('dm.status = :status', { status: MatchStatus.ASSIGNED })

            // 🔥 핵심
            .distinctOn(['u.id'])
            .orderBy('u.id', 'ASC')
            .addOrderBy('last_cm.created_at', 'DESC')

            .groupBy('u.id')
            .addGroupBy('dp.id')
            .addGroupBy('cr.id')
            .addGroupBy('last_cm.id')

            .setParameter('userId', userId)

            .getRawMany();
    }

    async getPartnerChatRoom(userId: number): Promise<any[]> {
        return await this.chatRoomRepository
            .createQueryBuilder('cr')
            .innerJoin('cr.participantA', 'u')

            // 마지막 메시지
            .leftJoin(
                'chat_messages',
                'last_cm',
                'last_cm.chat_room_id = cr.id AND last_cm.is_deleted = false'
            )

            // unread
            .leftJoin(
                'chat_messages',
                'unread_cm',
                `unread_cm.chat_room_id = cr.id 
                AND unread_cm.sender_id <> :userId
                AND unread_cm.is_read = false
                AND unread_cm.is_deleted = false`
            )

            .select([
                'cr.id AS "roomId"',
                'u.id AS id',
                'u.name AS name',
                'u.gender AS gender', 

                'last_cm.content AS "lastMessage"',
                `TO_CHAR(last_cm.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "lastMessageAt"`,

                'COUNT(DISTINCT unread_cm.id)::int AS "unreadCount"'
            ])

            .where('cr.participant_b_id = :participantBId', {
                participantBId: userId,
            })
            .andWhere('cr.status = :status', { status: 'OPEN' })

            .distinctOn(['cr.id'])
            .orderBy('cr.id', 'ASC')
            .addOrderBy('last_cm.created_at', 'DESC')

            .groupBy('cr.id')
            .addGroupBy('u.id')
            .addGroupBy('last_cm.id')
            .addGroupBy('u.gender')
            
            .setParameter('userId', userId)

            .getRawMany();
    }


    async findUserRoomInfo(userId:number, partnerId:number): Promise<ChatRoom | null> {
        return await this.chatRoomRepository.createQueryBuilder('cr')
                        .where('cr.participant_a_id = :aId', { aId: userId })
                        .andWhere('cr.participant_b_id = :bId', { bId: partnerId })
                        .andWhere('cr.status = :status', { status: 'OPEN' })
                        .getOne();
    }

    async findChatMessages(roomId:number): Promise<ChatMessageDataItem[]> {
        return await this.chatMessageRepository.createQueryBuilder('cm')
                        .select([
                            'cm.id AS id',
                            'cm.sender_id AS "senderId"',
                            'cm.content AS content',
                            `TO_CHAR(cm.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"`,
                            'cm.original_name AS "originalName"',
                            'cm.mime_type AS "mimeType"',
                            'cm.size AS size',
                            'cm.chat_content_type AS "chatContentType"'
                        ])
                        .where('cm.chat_room_id = :roomId', { roomId })
                        .andWhere('cm.is_deleted = false')
                        .getRawMany();
    }

    async updateMessageRead(roomId:number, userId:number) {
        await this.chatMessageRepository.createQueryBuilder()
                .update(ChatMessage)
                .set({ isRead: true })
                .where('chat_room_id = :roomId', { roomId })
                .andWhere('sender_id <> :userId', { userId }) // 내가 보낸 메시지 제외
                .andWhere('is_read = false')
                .execute();
    }

    async updateSendMessageRead(id:number) {
        await this.chatMessageRepository.createQueryBuilder()
                .update(ChatMessage)
                .set({ isRead: true })
                .where("id = :id", { id })
                .execute();
    }

}