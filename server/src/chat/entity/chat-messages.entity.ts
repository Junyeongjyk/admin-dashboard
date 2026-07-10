import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chat-rooms.entity";
import { User } from "../../user/entity/user.entity";

@Entity({ name: 'chat_messages' })
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'bigint', name: 'chat_room_id' })
    chatRoomId?: number;
    
    @Column({ type: 'bigint', name:'sender_id' })
    senderId?: number;

    @Column({
        type: 'varchar',
        length: 20,
        name: 'message_type',
        nullable: true
    })
    messageType?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    content?: string | null;

    @Column({
        type: 'boolean',
        nullable: true,
        default: false,
        name: 'is_deleted'
    })
    isDeleted?: boolean;

    
    @Column({
        type: 'boolean',
        nullable: true,
        default: false,
        name: 'is_read'
    })
    isRead?: boolean;


    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at'
    })
    createdAt?: Date;

    @Column({
        type: 'varchar',
        length: 255,
        name: 'original_name',
        nullable: true,
        default: null,
    })
    originalName?: string | null;

    @Column({
        type: 'varchar',
        length: 100,
        name: 'mime_type',
        nullable: true,
        default: null,
    })
    mimeType?: string | null;

    @Column({
        type: 'bigint',
        nullable: true,
        default: null,
    })
    size?: number | null;

    @Column({
        type: 'boolean',
        name: 'chat_content_type',
        nullable: false,
        default: false,
    })
    chatContentType?: boolean;

    @ManyToOne(() => ChatRoom, {
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'chat_room_id' })
    chatRoom?: ChatRoom;

    @ManyToOne(() => User, {
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
    })
    @JoinColumn({ name: 'sender_id' })
    sender?: User;
}