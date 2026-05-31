import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS = Symbol('REDIS');
@Global()
@Module({
    providers: [
    {
        provide: REDIS,
        useFactory: () => {
        return new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT ?? 6379),
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: 3,
            connectTimeout: 5000,
            retryStrategy: (times) => Math.min(times * 200, 2000),
        });
        },
    },
    ],
    exports: [REDIS],
})
export class RedisModule {}