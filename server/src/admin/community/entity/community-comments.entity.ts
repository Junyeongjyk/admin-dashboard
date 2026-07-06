import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../user/entity/user.entity";
import { CommunityPost } from "./community-posts.entity";

@Entity({ name: 'community_comments' })
export class CommunityComment {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    /* ===============================
    * FK 컬럼들
    * =============================== */

    // post_id (BIGINT)
    @Column({ name: 'post_id', type: 'bigint' })
    postId: number;

    // author_id (BIGINT)
    @Column({ name: 'author_id', type: 'bigint' })
    authorId: number;

    // parent_id (BIGINT, nullable)
    @Column({ name: 'parent_id', type: 'bigint', nullable: true })
    parentId: number | null | undefined;

    /* ===============================
    * 데이터 컬럼
    * =============================== */

    @Column({ name: 'content', type: 'text' })
    content: string;

    @Column({
        name: 'is_deleted',
        type: 'boolean',
        nullable: true,
        default: () => 'false',
    })
    isDeleted: boolean | null;

    /* ===============================
    * 타임스탬프
    * =============================== */

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

    /* ===============================
    * 관계 설정
    * =============================== */

    // 작성자
    @ManyToOne(() => User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
    author: User;

    // 게시글
    @ManyToOne(() => CommunityPost, (post) => post.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post: CommunityPost;

    // 부모 댓글 (대댓글)
    @ManyToOne(() => CommunityComment, (comment) => comment.children, {
        onDelete: 'NO ACTION',
    })
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent: CommunityComment | null;

    // 자식 댓글들
    @OneToMany(() => CommunityComment, (comment) => comment.parent)
    children: CommunityComment[];
}