import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatRoomsTable1780739137026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE chat_rooms (
                id BIGINT PRIMARY KEY,
                request_id BIGINT NOT NULL REFERENCES requests(id),
                participant_a_id BIGINT NOT NULL REFERENCES users(id),
                participant_a_role VARCHAR(20) DEFAULT 'CLIENT',
                participant_b_id BIGINT NOT NULL REFERENCES users(id),
                participant_b_role VARCHAR(20) DEFAULT 'PARTNER',
                room_type VARCHAR(20),
                status VARCHAR(20) DEFAULT 'OPEN',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                closed_at TIMESTAMPTZ
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
