import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('banner')
export class Banner {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'id',
    })
    id?: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    position?: string;

    @Column({
        name: 'display_target',
        type: 'varchar',
        length: 50,
    })
    displayTarget?: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    title?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    content?: string | null;

    @Column({
        name: 'button_title',
        type: 'text',
        nullable: true,
    })
    buttonTitle?: string | null;

    @Column({
        type: 'text',
        nullable: true,
    })
    link?: string | null;

    @Column({
        name: 'is_enabled',
        type: 'boolean',
        default: true,
    })
    isEnabled?: boolean;

    @Column({
        name: 'ended_at',
        type: 'timestamptz',
        nullable: true,
    })
    endedAt?: Date | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt?: Date;
}