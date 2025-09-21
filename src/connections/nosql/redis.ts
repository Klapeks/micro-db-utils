
import { Logger } from '@klapeks/utils';
import { createClient } from 'redis';

const logger = new Logger("Redis");

export class RedisConnection {

    readonly redisClient: ReturnType<typeof createClient>;

    constructor(readonly options: {
        clientName: string,
        keyPrefix: string
    }) {
        if (!options.keyPrefix.endsWith(':')) {
            options.keyPrefix = options.keyPrefix + ':'
        }
        this.redisClient = createClient({ name: options.clientName });
    }

    get keyPrefix() {
        return this.options.keyPrefix;
    }
    async initialize() {
        return this.redisClient.connect();
    }

    async remove(key: string) {
        const result = await this.redisClient.del(this.keyPrefix + key);
        return result === 1;
    }

    async get<T = any>(key: string): Promise<T | null> {
        const data = await this.redisClient.get(this.keyPrefix + key);
        return data ? JSON.parse(data) : null;
    }
    async setExpired(key: string, value: any, options?: {
        expiredAt?: Date | number,
        /** in seconds */
        expiredInSeconds?: number
    }) {
        // calculating expire
        let expire = options?.expiredInSeconds || -1;
        if (options?.expiredAt) {
            if (options.expiredAt instanceof Date) {
                expire = options.expiredAt.getTime()
            } else expire = options.expiredAt;
            expire = ((expire - Date.now()) / 1000) | 0;
        }
        if (!expire || expire <= 0) expire = undefined as any;

        // saving value in cache
        try {
            await this.redisClient.set(this.keyPrefix + key, 
                JSON.stringify(value), { EX: expire });
        } catch (err) {
            logger.error("Error while setting", 
                value, "with expire of", expire);
            throw err;
        }
    }
}
