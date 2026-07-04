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