import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommunityCommentsTable1780739344442 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE community_comments (
                id BIGINT PRIMARY KEY,
                post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
                author_id BIGINT NOT NULL REFERENCES users(id),
                content TEXT NOT NULL,
                parent_id BIGINT REFERENCES community_comments(id),
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
