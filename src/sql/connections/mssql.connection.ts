import { DatabaseOptions, Logger } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
import { quietRequire } from '../../utils/quiet.require';

const mssql = quietRequire<typeof import('mssql')>('mssql');
import type { 
    ConnectionPool as MSSQL_ConnectionPool,
    config as MSSQL_ConnectionOptions,
} from 'mssql';

const logger = new Logger('MSSQL');

export class MSSQLConnection extends AbstractSQLConnection {

    private _pool: MSSQL_ConnectionPool | undefined;

    readonly poolOptions: MSSQL_ConnectionOptions;
    constructor(options: DatabaseOptions & { type: "mssql" }) {
        super(options, 'toMSSQL');
        this.poolOptions = {
            user: options.username,
            password: options.password,
            server: options.host,
            port: options.port,
            database: options.database,
            // charset: options.charset,
            options: options.extra || options.options,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            }
        }
    }

    async initConnection(): Promise<void> {
        await this.getPoolConnection();
    }

    get pool() {
        return this._pool;
    }

    async getPoolConnection(): Promise<MSSQL_ConnectionPool> {
        if (!mssql) throw "mssql module is not installed";
        if (this._pool) return this._pool;

        this._pool = await new mssql.ConnectionPool(this.poolOptions).connect();
        return this._pool;
    }
    async destroyConnection() {
        return new Promise<void>((resolve, reject) => {
            if (!this._pool) return resolve();
            this._pool.close((err) => {
                this._pool = undefined;
                if (err) reject(err);
                else resolve();
            })
        });
    }
    async sendSQL<T = any>(query: string, params?: any): Promise<T[]> {
        const connection = await this.getPoolConnection();
        const request = connection.request();
        if (params) {
            if (Array.isArray(params) && params.length) {
                for (let i = 0; i < params.length; i++) {
                    query = query.replace('?', '@arg' + i);
                    request.input('arg' + i, params[i]);
                }
            } else {
                for (const [key, value] of Object.entries(params)) {
                    request.input(key, value as any);
                }
            }
        }
        this.debugQuery(query, params);
        const result = await request.query(query);
        return (result.recordset ?? []) as T[]
    }
}