import mysql2 from 'mysql2';
import { DatabaseOptions } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
export declare class MySQLConnection extends AbstractSQLConnection {
    private _pool;
    readonly poolOptions: mysql2.PoolOptions;
    constructor(options: DatabaseOptions & {
        type: "mysql";
    });
    initConnection(): Promise<void>;
    get pool(): mysql2.Pool | undefined;
    takePool(): Promise<mysql2.Pool>;
    destroyConnection(): Promise<void>;
    getPoolConnection(): Promise<mysql2.PoolConnection>;
    sendSQL<T = any>(query: string, params?: any): Promise<T[]>;
}
