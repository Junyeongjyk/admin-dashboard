import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommunityPostsTable1777543533669 implements MigrationInterface {
   
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE community_posts (
                id BIGINT PRIMARY KEY,
                category VARCHAR(50),
                title VARCHAR(200) NOT NULL,
                content TEXT,
                author_id BIGINT NOT NULL REFERENCES users(id),
                view_count INT DEFAULT 0,
                like_count INT DEFAULT 0,
                is_hidden BOOLEAN DEFAULT FALSE,
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
