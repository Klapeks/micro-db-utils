import { DatabaseOptions } from "@klapeks/utils";
import { ColumnType } from "typeorm";
import { MULTISQL_COLUMNS_TYPES } from "../utils";


// https://vscode.dev/github.com/typeorm/typeorm/blob/master/src/driver/mysql/MysqlDriver.ts#L750
// https://vscode.dev/github.com/typeorm/typeorm/blob/master/src/driver/sqlserver/SqlServerDriver.ts#L678
export function getRawDatabaseColumnTypeOfTypeORM(dbtype: DatabaseOptions['type'], type: ColumnType): ColumnType {
    if (type === Number) {
        if (dbtype == 'sqlite') return 'integer';
        if (dbtype == 'postgres') return 'integer';
        return 'int';
    }
    if (type === String) {
        if (dbtype === 'postgres') return 'character varying';
        if (dbtype === 'mssql') return 'nvarchar';
        return 'varchar'; 
    }
    if (type === Boolean) {
        if (dbtype === 'mssql') return 'bit';
        if (dbtype === 'mysql') return 'tinyint';
        return 'boolean';
    }
    if (type === Date) return MULTISQL_COLUMNS_TYPES.datetime;
    return type;
}


export interface MicroColumnTypeObject {
    type: ColumnType,
    primary?: boolean,
    length?: number,
    nullable?: boolean,
    default?: any
}
export namespace MicroColumnTypeObject {
    export function toSQLQuery(
        dbType: DatabaseOptions['type'], 
        options: MicroColumnTypeObject,
        queryType?: "create-table" | "alter-column",
    ): string {
        const columnType = getRawDatabaseColumnTypeOfTypeORM(dbType, options.type);
        const columnLength = options.length || ((
            columnType === 'varchar' 
            || columnType === 'nvarchar'
        ) ? 255 : undefined);
        
        let str = columnType + (columnLength ? `(${columnLength})` : '');
        
        // nullable
        if (options.nullable) str += ' NULL';
        else str += ' NOT NULL';

        // default
        if (options.default !== undefined) {
            let value = options.default;

            if (value === null || value === 'null' || value === 'NULL') {
                value = "NULL";
            } else if (typeof value === 'number') {
                value = value.toString(); // :)
            } else if (typeof value === 'boolean') {
                if (dbType === 'mssql') {
                    value = value ? '1' : '0';
                } else {
                    value = value ? "true" : "false";
                }
            } else if (typeof value === 'string') {
                value = `'${value.replace(/'/g, "''")}'`;
            } else if (typeof value === 'object') {
                value = `'${JSON.stringify(value)}'`;
            } else {
                value = `'${value}'`;
            }
            str += ` DEFAULT ${value}`;
        }

        // primary key
        if (queryType === 'create-table') {
            if (options.primary) {
                str += ' PRIMARY KEY';
            }
        }
        return str;
    }
}