import mysql2 from 'mysql2';
import { DatabaseOptions, Logger } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';

const logger = new Logger('MySQL');

export class MySQLConnection extends AbstractSQLConnection {

    private _pool: mysql2.Pool | undefined;

    readonly poolOptions: mysql2.PoolOptions;
    constructor(options: DatabaseOptions & { type: "mysql" }) {
        super('toMySQL');
        this.poolOptions = {
            user: options.username,
            password: options.password,
            host: options.host,
            port: options.port,
            database: options.database,
            charset: options.charset,
        }
    }

    async initConnection(): Promise<void> {
        await this.takePool();
    }

    get pool() {
        return this._pool;
    }

    async takePool(): Promise<mysql2.Pool> {
        if (this._pool) return this._pool;
        // if (this.options.type != 'mysql') throw "Not a mysql";
        this._pool = mysql2.createPool(this.poolOptions);

        this._pool.on('connection', () => {
            logger.log('Database connected');
        });
        this._pool.on('close', () => {
            logger.log('Database disconnected');
            this._pool?.end();
            this._pool = undefined;
        });

        return this._pool;
    }
    async destroyConnection() {
        return new Promise<void>((resolve, reject) => {
            if (!this._pool) return resolve();
            this._pool.end((err) => {
                this._pool = undefined;
                if (err) reject(err);
                else resolve();
            })
        })
    }

    async getPoolConnection(): Promise<mysql2.PoolConnection> {
        if (!this._pool) this._pool = await this.takePool();
        return new Promise((resolve, reject) => {
            if (!this._pool) return reject("Can't connect to (unknown) mysql");
            this._pool.getConnection((err, conn) => {
                if (err) return reject(err);
                resolve(conn);
            })
        })
    }
    async sendSQL<T = any>(query: string, params?: any): Promise<T[]> {
        const connection = await this.getPoolConnection();
        return new Promise<any>((resolve, reject) => {
            // logger.debug("SQL query: ", query, '| params:', params||[])
            connection.query(query, params || [], (err, result) => {
                connection.release();
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}