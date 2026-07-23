import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { ChatBannedWord } from "../../chat/entity/chat-banned-words.entity";
import { ChatRoom } from "../../chat/entity/chat-rooms.entity";
import { AdminChatRoomItemDto, AdminChatRoomListDto } from "./dto/data/chat-room-search.dto";
import { ChatAdminMessageDataItem } from "./dto/data/chat-message-list-data.dto";
import { ChatMessage } from "../../chat/entity/chat-messages.entity";

@Injectable()
export class ChatRepository {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ChatBannedWord)
        private readonly chatBannedWordRepository: Repository<ChatBannedWord>,
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepository: Repository<ChatMessage>,
        
    ) {}
    
    async saveChatMessage(chatMessage: ChatMessage): Promise<ChatMessage> {
        return await this.chatMessageRepository.save(chatMessage)
    }

    async findByIdChatRoom(roomId:number): Promise<ChatRoom | null> {
        return await this.chatRoomRepository.createQueryBuilder('cr')
                        .where('cr.id = :roomId', {roomId})
                        .getOne()
    }

    async findChatMessages(roomId:number, userId:number): Promise<ChatAdminMessageDataItem[]> {
        return await this.chatMessageRepository.createQueryBuilder('cm')
            .select([
                'cm.id AS id',
                'cm.sender_id AS "senderId"',
                'cm.content AS content',
                `TO_CHAR(cm.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"`,
                `CASE 
                    WHEN cm.sender_id = :userId THEN true
                    ELSE false
                END AS "isMine"`,
                'cm.original_name AS "originalName"',
                'cm.mime_type AS "mimeType"',
                'cm.size AS size',
                'cm.chat_content_type AS "chatContentType"'
            ])
            .where('cm.chat_room_id = :roomId', { roomId })
            .andWhere('cm.is_deleted = false')
            .setParameter('userId', userId)
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

    async getList(page: number, size: number, type: string | null = null, q = '') {
        const offset = (page - 1) * size;

        const qb = this.chatRoomRepository
            .createQueryBuilder('cr')
            .distinctOn(['cr.id'])
            .innerJoin('users', 'u', 'u.id = cr.participant_a_id')
            .leftJoin('Partner_profiles', 'dp', 'dp.user_id = u.id')
            .leftJoin('chat_messages', 'cm', 'cm.chat_room_id = cr.id AND cm.is_read = false')

            // last message: subQuery + distinctOn() 사용 (문법 안전)
            .leftJoin(
            (subQ) =>
                subQ
                    .subQuery()
                    .select('m.chat_room_id', 'chat_room_id')
                    .addSelect('m.content', 'content')
                    .addSelect('m.created_at', 'created_at')
                    .addSelect('m.id', 'id')
                    .from('chat_messages', 'm')
                    .distinctOn(['m.chat_room_id'])
                    // DISTINCT ON 규칙: orderBy 첫 번째는 distinctOn 컬럼
                    .orderBy('m.chat_room_id', 'ASC')
                    .addOrderBy('m.created_at', 'DESC')
                    .addOrderBy('m.id', 'DESC'),
                'lm',
                'lm.chat_room_id = cr.id',
            )

            .select([
                'cr.id AS "roomId"',
                'u.user_type AS "userType"',
                'u.id AS "id"',
                'u.name AS "name"',
                'dp.nickname AS "nickname"',
                'dp.region AS "region"',
                'dp.career_years AS "careerYears"',
                'dp.introduction AS "introduction"',
                'dp.rating_avg AS "ratingAvg"',
                'u.gender AS "gender"',
                'COUNT(cm.id) OVER (PARTITION BY cr.id) AS "readCnt"',
                'lm.content AS "lastMessage"',
                `TO_CHAR(lm.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "lastMessageAt"`,
            ])
            .where('cr.participant_b_role = :role', { role: 'ADMIN' })
            .andWhere('cr.status = :status', { status: 'OPEN' })
            .orderBy('cr.id', 'ASC')
            .addOrderBy('lm.created_at', 'DESC', 'NULLS LAST')
            .addOrderBy('lm.content', 'ASC');

        if (type) qb.andWhere('u.user_type = :type', { type });
        if (q) qb.andWhere('u.name ILIKE :name', { name: `%${q}%` });

        qb.skip(offset).take(size);

        const data = await qb.getRawMany();

        const countQb = this.chatRoomRepository
            .createQueryBuilder('cr')
            .select('COUNT(DISTINCT cr.id)', 'total')
            .innerJoin('users', 'u', 'u.id = cr.participant_a_id')
            .where('cr.participant_b_role = :role', { role: 'ADMIN' })
            .andWhere('cr.status = :status', { status: 'OPEN' });

        if (type) countQb.andWhere('u.user_type = :type', { type });
        if (q) countQb.andWhere('u.name ILIKE :name', { name: `%${q}%` });

        const countResult = await countQb.getRawOne<{ total: string }>();
        const total = Number(countResult?.total ?? 0);

        return {
            data: data.map((r) => ({
                ...r,
                roomId: Number(r.roomId),
                id: Number(r.id),
                readCnt: Number(r.readCnt ?? 0),
                ratingAvg: r.ratingAvg != null ? Number(r.ratingAvg) : null,
                lastMessageAt: r.lastMessageAt ? r.lastMessageAt : null,
            })),
            total,
            currentPage: page,
            limit: size,
        };
        }

    async bannedWordList(dto: any,): Promise<any> {
        const { page, size} = dto;

        const queryBuilder = this.chatBannedWordRepository.createQueryBuilder('ban')
            .leftJoinAndSelect('ban.createdBy', 'User')
            .skip(page)
            .take(size);

        const [data, total] = await queryBuilder.getManyAndCount();
        // console.log(data)
        return {
            data,
            total,
            currentPage: page,
            limit: size,
        };
    }

    async bannedWordCreate(dto: any, token: any): Promise<any> 
    {
        const { word } = dto
        const userId = token.id
        const bannedWord = this.chatBannedWordRepository.create({
            word,
            createdBy: { id: userId } as any,
        });

        return await this.chatBannedWordRepository.save(bannedWord);
    }
    async bannedWordDelete(dto: any): Promise<any> 
    {
        const { id } = dto
        return await this.chatBannedWordRepository.delete(id);
    }

    async findByIdInfo(id:number): Promise<User | null> {
        return await this.usersRepository.createQueryBuilder('u')
                        .where('u.id = :id', {id})
                        .getOne();
    }

    async updateSendMessageRead(id:number) {
        await this.chatMessageRepository.createQueryBuilder()
                .update(ChatMessage)
                .set({ isRead: true })
                .where("id = :id", { id })
                .execute();
    }
}