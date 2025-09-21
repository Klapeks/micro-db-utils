import type { createClient as REDIS_createClient } from 'redis';
export declare class RedisConnection {
    readonly options: {
        clientName: string;
        keyPrefix: string;
    };
    readonly redisClient: ReturnType<typeof REDIS_createClient>;
    constructor(options: {
        clientName: string;
        keyPrefix: string;
    });
    get keyPrefix(): string;
    initialize(): Promise<void>;
    remove(key: string): Promise<boolean>;
    get<T = any>(key: string): Promise<T | null>;
    setExpired(key: string, value: any, options?: {
        expiredAt?: Date | number;
        /** in seconds */
        expiredInSeconds?: number;
    }): Promise<void>;
}
