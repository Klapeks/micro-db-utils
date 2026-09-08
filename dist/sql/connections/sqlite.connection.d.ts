import { DatabaseOptions } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
import type { Database as SQLite3Database } from 'sqlite3';
export declare class SQLiteConnection extends AbstractSQLConnection {
    private _db;
    constructor(options: DatabaseOptions & {
        type: "sqlite";
    });
    initConnection(): Promise<void>;
    getConnection(): Promise<SQLite3Database>;
    destroyConnection(): Promise<void>;
    sendSQL<T = any>(query: string, params?: any): Promise<T[]>;
}
