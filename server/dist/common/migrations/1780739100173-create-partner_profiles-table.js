"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePartnerProfilesTable1780739100173 = void 0;
class CreatePartnerProfilesTable1780739100173 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE partner_profiles (
                id BIGINT PRIMARY KEY,
                user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                nickname VARCHAR(50) NOT NULL,
                introduction TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreatePartnerProfilesTable1780739100173 = CreatePartnerProfilesTable1780739100173;
//# sourceMappingURL=1780739100173-create-partner_profiles-table.js.map