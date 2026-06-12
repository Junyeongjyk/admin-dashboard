import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "../../user/entity/users.entity";

@Entity({ name: 'partner_profiles' })
export class PartnerProfiles {

    @PrimaryGeneratedColumn()
    id: number;
    
    /**
     * users.id (1:1)
     */
    @Column({ type: 'bigint', name: 'user_id' })
    userId: number;

    @OneToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ type: 'varchar', length: 50 })
    nickname: string;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @Column({
        name: 'profile_path',
        type: 'varchar',
        nullable: true,
    })
    profilePath: string | null;

}