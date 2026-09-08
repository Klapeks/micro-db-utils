import { DatabaseOptions, getRawDatabaseColumnTypeOfTypeORM } from "@klapeks/utils";
import { ColumnType } from "typeorm";

export { getRawDatabaseColumnTypeOfTypeORM };

export interface MicroColumnTypeObject {
    type: ColumnType,
    primary?: boolean,
    length?: number,
    nullable?: boolean,
    default?: any,
    generated?: true | "increment"
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

        // auto increment
        if (options.generated) {
            if (dbType === 'mssql') str += ' IDENTITY';
            else if (dbType === 'mysql') str += ' AUTO_INCREMENT';
            else if (dbType === 'sqlite') { /** after primary key */ }
            else throw "options.generated is not supported yet for " + dbType;
        }

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
            if (dbType === 'sqlite' && options.generated) {
                str += ' AUTOINCREMENT';
            }
        }
        return str;
    }
}