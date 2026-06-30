"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoticeAttachmentsTable1777543242771 = void 0;
class CreateNoticeAttachmentsTable1777543242771 {
    async up(queryRunner) {
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
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreateNoticeAttachmentsTable1777543242771 = CreateNoticeAttachmentsTable1777543242771;
//# sourceMappingURL=1777543242771-create-notice_attachments-table.js.map