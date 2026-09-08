import { DatabaseOptions, Logger } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
import { quietRequire } from '../../utils/quiet.require';

const sqlite3 = quietRequire<typeof import('sqlite3')>('sqlite3');
import type { RunResult, Database as SQLite3Database, Statement } from 'sqlite3';

const logger = new Logger('SQLite');

export class SQLiteConnection extends AbstractSQLConnection {

    private _db: SQLite3Database | undefined;
    constructor(options: DatabaseOptions & { type: "sqlite" }) {
        super(options, 'toSQLite');
    }

    async initConnection(): Promise<void> {
        await this.getConnection();
    }

    async getConnection(): Promise<SQLite3Database> {
        if (!sqlite3) throw "sqlite3 module is not installed";
        if (this._db) return this._db;
        this._db = new sqlite3!.Database(this.rawOptions.database);
        this._db.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA busy_timeout = 15000;
        `);
        return this._db;
    }

    async destroyConnection(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._db) return resolve();
            try {
                this._db.close((err) => {
                    logger.log('Database disconnected');
                    if (err) reject(err);
                    else resolve();
                });
            } catch (err) {
                reject(err);
            } finally {
                this._db = undefined;
            }
        });
    }

    async sendSQL<T = any>(query: string, params?: any): Promise<T[]> {
        const connection = await this.getConnection();
        return new Promise<T[]>((resolve, reject) => {
            this.debugQuery(query, params);
            const upperSQL = query.trim().toUpperCase();

            if (upperSQL.startsWith('BEGIN') 
             || upperSQL.startsWith('COMMIT') 
             || upperSQL.startsWith('ROLLBACK')
            ) {
                return connection.exec(query, (err: any) => {
                    if (err) return reject(err);
                    resolve([]);
                });
            }

            if (!params) params = [];
            if (upperSQL.startsWith('SELECT')) {
                return connection.all(query, params, (err1: any, rows: any[]) => {
                    if (err1) return reject(err1);
                    resolve((rows || []) as T[]);
                });
            }
            return connection.run(query, params, function (this: RunResult, err1: any) {
                if (err1) return reject(err1);
                resolve(this as any);
            });
        });
    }
}