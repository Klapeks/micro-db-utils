import { ColumnType } from "typeorm"
import { ISQLCommandAdapter } from "./abstract.sql.command"
import { MicroColumnTypeObject } from "../column.type.parser"
import { columns } from "mssql"
import { DatabaseOptions } from "@klapeks/utils"

export class SQLTablesCommands {

    static renameTable(old_name: string, new_name: string): ISQLCommandAdapter {
        return {
            toMySQL: () => `RENAME TABLE \`${old_name}\` TO \`${new_name}\`;`,
            toMSSQL: () => `EXEC sp_rename '${old_name}', '${new_name}';`,
            // PG: ALTER TABLE "old_name" RENAME TO "new_name";
            // SQLITE: ALTER TABLE "old_name" RENAME TO "new_name";
        }
    }


    
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
                _index += 1;

                if (dbtype === 'mysql') str += `\`${columnName}\` `;
                else if (dbtype === 'mssql') str += `[${columnName}] `;
                else if (dbtype === 'postgres') str += `"${columnName}" `;
                else str += `${columnName} `;

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


    static getTablesSizes(database: string): ISQLCommandAdapter {
        return {
            toMySQL: () => `
                SELECT 
                    TABLE_NAME as 'table_name', 
                    (DATA_LENGTH / 1024) as 'data_kb', 
                    (INDEX_LENGTH / 1024) as 'index_kb'
                FROM information_schema.TABLES
                WHERE table_schema = '${database}'
                ORDER BY (data_kb + index_kb) DESC;
            `,
            toMSSQL: () => `
                SELECT * FROM (
                    SELECT
                        t.name AS table_name,
                        SUM(ps.in_row_data_page_count + ps.lob_used_page_count
                            + ps.row_overflow_used_page_count
                            ) * 8 AS data_kb,
                        SUM(ps.used_page_count - ps.in_row_data_page_count
                            - ps.lob_used_page_count - ps.row_overflow_used_page_count
                            ) * 8 AS index_kb
                    FROM sys.tables t
                    JOIN sys.dm_db_partition_stats ps
                        ON t.object_id = ps.object_id
                    GROUP BY t.name
                ) t ORDER BY (data_kb + index_kb) DESC;
            `,

            // postgress
            // SELECT
            //     relname AS table_name,
            //     pg_relation_size(relid) / 1024 AS data_kb,
            //     pg_indexes_size(relid) / 1024 AS index_kb
            // FROM pg_catalog.pg_statio_user_tables
            // ORDER BY pg_total_relation_size(relid) DESC;

            // sqlite
            // 1. SELECT
            //     name AS table_name
            // FROM sqlite_master
            // WHERE type = 'table';
            // 2. SELECT
            //     SUM(pgsize) / 1024.0 AS data_kb
            // FROM dbstat
            // WHERE name = ?;
        }
    }
}