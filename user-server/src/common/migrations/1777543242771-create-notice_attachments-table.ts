import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoticeAttachmentsTable1777543242771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE notice_attachments (
                id BIGINT PRIMARY KEY,
                notice_id BIGINT NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
                file_name VARCHAR(255),
                file_url TEXT NOT NULL,
                file_size BIGINT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
