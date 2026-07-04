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
    nullable?: boolean
}
export namespace MicroColumnTypeObject {
    export function toSQLQuery(
        dbType: DatabaseOptions['type'], 
        options: MicroColumnTypeObject,
        queryType?: "create-table" | "alter-column"
    ): string {
        const columnType = getRawDatabaseColumnTypeOfTypeORM(dbType, options.type);
        const columnLength = options.length || ((
            columnType === 'varchar' 
            || columnType === 'nvarchar'
        ) ? 255 : undefined);
        
        let str = columnType + (columnLength ? `(${columnLength})` : '');
        if (options.nullable) str += ' NULL';
        else str += ' NOT NULL';

        if (queryType === 'create-table') {
            if (options.primary) {
                str += ' PRIMARY KEY';
            }
        }
        return str;
    }
}