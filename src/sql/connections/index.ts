import { DatabaseOptions } from '@klapeks/utils';
import { AbstractSQLConnection } from './abstract.connection';
import { MySQLConnection } from './mysql.connection';
import { MSSQLConnection } from './mssql.connection';


export function isDatabaseTypeIs<T extends DatabaseOptions['type']>(
    options: DatabaseOptions, type: T
): options is (DatabaseOptions & { type: T }) {
    return options.type === type;
}

export function createSQLConnection(options: DatabaseOptions): AbstractSQLConnection {
    if (isDatabaseTypeIs(options, 'mysql')) return new MySQLConnection(options);
    if (isDatabaseTypeIs(options, 'mssql')) return new MSSQLConnection(options);
    throw "Connection for database type " + options.type + ' is not implemented :(';
}

export * from './abstract.connection';
export * from './mysql.connection';
export * from './mssql.connection';
