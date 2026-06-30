"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommunityPostsTable1777543533669 = void 0;
class CreateCommunityPostsTable1777543533669 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE community_posts (
                id BIGINT PRIMARY KEY,
                category VARCHAR(50),
                title VARCHAR(200) NOT NULL,
                content TEXT,
                author_id BIGINT NOT NULL REFERENCES users(id),
                view_count INT DEFAULT 0,
                like_count INT DEFAULT 0,
                is_hidden BOOLEAN DEFAULT FALSE,
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
    async down(queryRunner) {
    }
}
exports.CreateCommunityPostsTable1777543533669 = CreateCommunityPostsTable1777543533669;
//# sourceMappingURL=1777543533669-create-community_posts-table.js.map