"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)();
const isMigrationMode = process.env.MIGRATION_MODE === 'true';
exports.databaseConfig = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: false,
    poolSize: 10,
    migrations: isMigrationMode ? ['src/common/migrations/*.{ts,js}'] : [], // migration 수행할 파일
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=database.config.js.map