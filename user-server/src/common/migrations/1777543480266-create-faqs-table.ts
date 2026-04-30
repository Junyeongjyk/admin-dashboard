import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFaqsTable1777543480266 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE faqs (
                id BIGINT PRIMARY KEY,
                category VARCHAR(50),
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                is_published BOOLEAN DEFAULT TRUE,
                display_order INT DEFAULT 0,
                created_by BIGINT REFERENCES admin_accounts(id),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
