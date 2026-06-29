import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/users.entity";

@Entity({ name: 'faqs' })
export class Faqs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'FAQ 카테고리',
    })
    category: string;

    @Column({
        type: 'text',
        comment: '질문',
    })
    question: string;

    @Column({
        type: 'text',
        comment: '답변',
    })
    answer: string;

    @Column({
        name: 'is_published',
        type: 'boolean',
        default: true,
        comment: '게시 여부',
    })
    isPublished: boolean;

    @Column({
        name: 'display_order',
        type: 'int',
        default: 0,
        comment: '노출 순서',
    })
    displayOrder: number;

    @Column({
        name: 'created_by',
        type: 'bigint',
        nullable: true,
        comment: '작성 관리자 ID',
    })
    createdBy: number | null;

    @ManyToOne(() => User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', nullable: true })
    @JoinColumn({ name: 'created_by' })
    admin: User | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
    
}