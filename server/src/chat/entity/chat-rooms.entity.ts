import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity({ name: 'chat_rooms' })
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'bigint', name: 'participant_a_id' })
    participantAId?: number;

    @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'participant_a_id' })
    participantA?: User;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        default: 'CLIENT',
        name: 'participant_a_role'
    })
    participantARole?: string;

    @Column({ type: 'bigint', name: 'participant_b_id' , nullable:true,  })
    participantBId?: number | null;

    @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'participant_b_id' })
    participantB?: User;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        default: 'PARTNER',
        name: 'participant_b_role'
    })
    participantBRole?: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        name: 'room_type'
    })
    roomType?: string | null;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        default: 'OPEN',
    })
    status?: string;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at'
    })
    createdAt?: Date;

    @Column({
        type: 'timestamptz',
        nullable: true,
        name: 'closed_at'
    })
    closedAt?: Date | null;
}