import { DatabaseOptions } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
export declare function isDatabaseTypeIs<T extends DatabaseOptions['type']>(options: DatabaseOptions, type: T): options is (DatabaseOptions & {
    type: T;
});
export declare function createSQLConnection(options: DatabaseOptions): AbstractSQLConnection;
export * from './abstract.connection';
export * from './mysql.connection';
export * from './mssql.connection';
