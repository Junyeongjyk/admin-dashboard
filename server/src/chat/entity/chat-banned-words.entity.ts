import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity({ name: 'chat_banned_words' })
@Entity('chat_banned_words')
export class ChatBannedWord {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id?: string; // bigint는 JS에서 string으로 받는걸 권장

    @Column({ type: 'varchar', length: 255 })
    word?: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by' })
    createdBy?: User;

    @CreateDateColumn({name: 'created_at', type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at',type: 'timestamp' })
    updatedAt?: Date;
}