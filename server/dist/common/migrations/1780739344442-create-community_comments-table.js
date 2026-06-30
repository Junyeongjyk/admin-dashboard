"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommunityCommentsTable1780739344442 = void 0;
class CreateCommunityCommentsTable1780739344442 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE community_comments (
                id BIGINT PRIMARY KEY,
                post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
                author_id BIGINT NOT NULL REFERENCES users(id),
                content TEXT NOT NULL,
                parent_id BIGINT REFERENCES community_comments(id),
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreateCommunityCommentsTable1780739344442 = CreateCommunityCommentsTable1780739344442;
//# sourceMappingURL=1780739344442-create-community_comments-table.js.map