import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../user/entity/user.entity";

@Entity('ip_access_control')
export class IpAccessControl {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'ip_address', type: 'varchar', length: 45 })
    ipAddress?: string;

    @Column({
        name: 'control_type',
        type: 'varchar',
        length: 20,
        nullable: true,
        default: null,
    })
    controlType?: string | null;

    @Column({
        name: 'reason',
        type: 'text',
        nullable: true,
        default: null,
    })
    reason?: string | null;

    @Column({
        name: 'is_active',
        type: 'boolean',
        nullable: true,
        default: true,
    })
    isActive?: boolean | null;

    @Column({
        name: 'created_by',
        type: 'bigint',
        nullable: true,
        default: null,
    })
    createdBy?: number | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    createdAt?: Date | null;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    updatedAt?: Date | null;

    @ManyToOne(() => User, { nullable: true, onUpdate: 'NO ACTION', onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'created_by' })
    creator?: User | null;
}