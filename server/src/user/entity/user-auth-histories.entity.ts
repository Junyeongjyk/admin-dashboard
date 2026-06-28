import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { LoginAction } from "../../common/enum/users.enum";

@Entity({ name: 'user_auth_histories' })
export class UserAuthHistories {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'bigint', nullable: true })
    userId: number | null;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: LoginAction,
        comment: 'LOGIN | LOGOUT',
    })
    action: string;


    @Column({
        name: 'ip_address',
        type: 'varchar',
        length: 45,
        nullable: true,
    })
    ipAddress: string | null;

    @Column({
        name: 'user_agent',
        type: 'text',
        nullable: true,
    })
    userAgent: string | null;

    @Column({
        name: 'uuid',
        type: 'varchar',
        nullable: true,
        comment: '모바일 앱 디바이스 UUID',
    })
    uuid: string | null;

    @Column({
        name: 'is_success',
        type: 'boolean',
        default: true,
    })
    isSuccess: boolean;

    @Column({
        name: 'fail_reason',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    failReason: string | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}