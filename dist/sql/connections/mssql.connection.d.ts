import { DatabaseOptions } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
import type { ConnectionPool as MSSQL_ConnectionPool, config as MSSQL_ConnectionOptions } from 'mssql';
export declare class MSSQLConnection extends AbstractSQLConnection {
    private _pool;
    readonly poolOptions: MSSQL_ConnectionOptions;
    constructor(options: DatabaseOptions & {
        type: "mssql";
    });
    initConnection(): Promise<void>;
    get pool(): MSSQL_ConnectionPool | undefined;
    getPoolConnection(): Promise<MSSQL_ConnectionPool>;
    destroyConnection(): Promise<void>;
    sendSQL<T = any>(query: string, params?: any): Promise<T[]>;
}
