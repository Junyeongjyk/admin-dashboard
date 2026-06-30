"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatMessagesTable1780739129913 = void 0;
class CreateChatMessagesTable1780739129913 {
    async up(queryRunner) {
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
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreateChatMessagesTable1780739129913 = CreateChatMessagesTable1780739129913;
//# sourceMappingURL=1780739129913-create-chat_messages-table.js.map