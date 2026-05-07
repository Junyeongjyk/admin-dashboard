import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1777543097264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id BIGINT PRIMARY KEY,
                identity VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(50) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(100),
                birthday DATE,
                gender VARCHAR(10),
                user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('USER', 'PARTNER')),
                is_active BOOLEAN DEFAULT TRUE,
                is_email_verified BOOLEAN DEFAULT FALSE,
                last_login_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
