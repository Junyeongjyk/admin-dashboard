"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFaqsTable1777543480266 = void 0;
class CreateFaqsTable1777543480266 {
    async up(queryRunner) {
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
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreateFaqsTable1777543480266 = CreateFaqsTable1777543480266;
//# sourceMappingURL=1777543480266-create-faqs-table.js.map