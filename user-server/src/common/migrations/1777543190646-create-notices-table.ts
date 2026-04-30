import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoticesTable1777543190646 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE notices (
                id BIGINT PRIMARY KEY,
                category VARCHAR(50),
                target_user_type VARCHAR(20),
                priority VARCHAR(20),
                title VARCHAR(200) NOT NULL,
                content TEXT,
                is_published BOOLEAN DEFAULT FALSE,
                is_pinned BOOLEAN DEFAULT FALSE,
                view_count INT DEFAULT 0,
                reserved_at TIMESTAMPTZ,
                expired_at TIMESTAMPTZ,
                created_by BIGINT REFERENCES admin_accounts(id),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
