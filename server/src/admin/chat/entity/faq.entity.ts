import { Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn({comment: 'id'})
    id: number;

    /* ===== 기본 정보 ===== */
    @Column({ type: 'varchar', length: 50, comment: '아이디(이메일)' })
    identity: string;

    @Column({ type: 'varchar', length: 255, comment: '패스워드'})
    password: string;
}