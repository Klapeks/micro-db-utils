import { ColumnType } from "typeorm"
import { ISQLCommandAdapter } from "./abstract.sql.command"
import { MicroColumnTypeObject } from "../column.type.parser"
import { columns } from "mssql"
import { DatabaseOptions } from "@klapeks/utils"

export class SQLTablesCommands {
    
    static tableInfo(database: string, table: string): ISQLCommandAdapter {
        return {
            toMySQL: () => [
                `SELECT * FROM information_schema.tables`,
                `WHERE table_schema = '${database}'`,
                `AND table_name = '${table}'`,
                `LIMIT 1;`,
            ].join(' '),
            toMSSQL: () => [
                `SELECT TOP 1 * FROM INFORMATION_SCHEMA.TABLES`,
                `WHERE TABLE_CATALOG = '${database}'`,
                `AND TABLE_SCHEMA = 'dbo'`,
                `AND TABLE_NAME = '${table}'`,
            ].join(' '),
        }
    }

    static createTable(options: {
        table: string,
        columns: Record<string, MicroColumnTypeObject>
    }): ISQLCommandAdapter {
        const _createQuery = (dbtype: DatabaseOptions['type']) => {
            let str = `CREATE TABLE ${options.table} (`;
            let _index = 0;
            for (let [columnName, columnType] of Object.entries(options.columns)) {
                if (_index) str += ', ';
                str += `\`${columnName}\` `;
                str += MicroColumnTypeObject.toSQLQuery(
                    dbtype, columnType, 'create-table'
                );
            }
            str += ');';
            return str;
        }
        return {
            toMySQL: () => _createQuery('mysql'),
            toMSSQL: () => _createQuery('mssql'),
        }
    }
}