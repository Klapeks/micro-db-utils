import mysql2 from 'mysql2';
import { DatabaseOptions } from '@klapeks/utils';
export declare class RawMySQLConnection {
    private _pool;
    readonly poolOptions: mysql2.PoolOptions;
    constructor(options: DatabaseOptions & {
        type: "mysql";
    });
    get pool(): mysql2.Pool | undefined;
    takePool(): Promise<mysql2.Pool>;
    destroyConnection(): Promise<void>;
    getConnection(): Promise<mysql2.PoolConnection>;
    runSQL<T = any>(query: string, params?: any[]): Promise<T[]>;
    runSQL_One<T = any>(query: string, params?: any[]): Promise<T | null>;
}
