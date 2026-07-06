import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../user/entity/user.entity";
import { CommunityComment } from "./community-comments.entity";

@Entity({ name: 'community_posts' })
export class CommunityPost {

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'type', type: 'varchar', length: 50, nullable: true })
    type: string | null;

    @Column({ name: 'title', type: 'varchar', length: 200, nullable: false })
    title: string;

    @Column({ name: 'content', type: 'text', nullable: true })
    content: string | null;

    @Column({ name: 'author_id', type: 'bigint', nullable: false })
    authorId: number; 

    @Column({ name: 'view_count', type: 'int', nullable: true, default: () => '0' })
    viewCount: number | null;

    @Column({ name: 'like_count', type: 'int', nullable: true, default: () => '0' })
    likeCount: number | null;

    @Column({ name: 'is_hidden', type: 'boolean', nullable: true, default: () => 'false' })
    isHidden: boolean | null;

    @Column({ name: 'is_deleted', type: 'boolean', nullable: true, default: () => 'false' })
    isDeleted: boolean | null;

    // DDL: DEFAULT CURRENT_TIMESTAMP (nullable true)
    // TypeORM에서 동일하게 맞추려면 CreateDateColumn/UpdateDateColumn 사용 + default 지정
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date | null;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date | null;

    @Column({ name: 'main_image', type: 'varchar', nullable: true })
    mainImage: string | null; 

    @Column({ name: 'category', type: 'varchar', length: 50, nullable: true })
    category: string | null;

    @ManyToOne(() => User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
    author: User;

    @OneToMany(() => CommunityComment, (comment) => comment.post)
    comments: CommunityComment[];
}