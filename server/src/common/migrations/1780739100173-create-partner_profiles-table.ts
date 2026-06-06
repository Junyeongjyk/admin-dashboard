import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePartnerProfilesTable1780739100173 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE detective_profiles (
                id BIGINT PRIMARY KEY,
                user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                nickname VARCHAR(50) NOT NULL,
                introduction TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
