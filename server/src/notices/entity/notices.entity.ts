import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/users.entity";
import { NoticePriority } from "../../common/enum/notices.enum";

@Entity({ name: 'notices' })
export class Notices {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        comment: '공지 카테고리',
    })
    category: string;

    @Column({
        name: 'target_user_type',
        type: 'varchar',
        comment: '대상 사용자 유형',
    })
    targetUserType: string

    @Column({
        type: 'enum',
        enum: NoticePriority,
        comment: '공지 중요도 (NORMAL | IMPORTANT | URGENT)',
        default: NoticePriority.NORMAL
    })
    priority: NoticePriority;

    @Column({
        type: 'varchar',
        length: 200,
        comment: '공지 제목',
    })
    title: string;

    @Column({
        type: 'text',
        comment: '공지 내용',
    })
    content: string;

    @Column({
        name: 'is_published',
        type: 'boolean',
        default: false,
        comment: '게시 여부',
    })
    isPublished: boolean;

    @Column({
        name: 'is_pinned',
        type: 'boolean',
        default: false,
        comment: '상단 고정 여부',
    })
    isPinned: boolean;

    @Column({
        name: 'view_count',
        type: 'int',
        default: 0,
        comment: '조회수',
    })
    viewCount: number;

    @Column({
        name: 'created_by',
        type: 'varchar',
        nullable: true,
        comment: '작성 관리자',
    })
    createdBy: string;

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