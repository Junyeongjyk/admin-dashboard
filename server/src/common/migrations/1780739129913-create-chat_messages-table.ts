import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatMessagesTable1780739129913 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE chat_messages (
                id BIGINT PRIMARY KEY,
                chat_room_id BIGINT NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
                sender_id BIGINT NOT NULL REFERENCES users(id),
                message_type VARCHAR(20) NOT NULL,
                content TEXT,
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
