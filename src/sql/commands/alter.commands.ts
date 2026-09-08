import { utils } from "@klapeks/utils";
import { MicroSQL } from "../../micro.sql";
import { MicroColumnTypeObject } from "../column.type.parser";
import { ISQLCommandAdapter } from "./abstract.sql.command";

export class SQLAlterCommand {
    
    constructor(private readonly table: string) {}

    array(cb: (t: SQLAlterCommand) => ISQLCommandAdapter[]) {
        return cb(this); 
    }

    renameColumn(old_name: string, new_name: string): ISQLCommandAdapter {
        return {
            toMySQL: () => `ALTER TABLE \`${this.table}\` RENAME COLUMN \`${old_name}\` TO \`${new_name}\`;`,
            toMSSQL: () => `EXEC sp_rename '${this.table}.${old_name}', '${new_name}', 'COLUMN';`,
            toSQLite: () => `ALTER TABLE "${this.table}" RENAME COLUMN "${old_name}" TO "${new_name}";`,
        }
    }
    addColumn(column: string, type: MicroColumnTypeObject): ISQLCommandAdapter {
        return {
            toMySQL: () => `ALTER TABLE \`${this.table}\` ADD COLUMN \`${column}\` `
                + MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';',
            toMSSQL: () => `ALTER TABLE [${this.table}] ADD [${column}] `
                + MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';',
            toSQLite: () => `ALTER TABLE "${this.table}" ADD COLUMN "${column}" ` 
                + MicroColumnTypeObject.toSQLQuery("sqlite", type, "alter-column") + ";"
        }
    }

    changeColumnType(column: string, type: MicroColumnTypeObject): ISQLCommandAdapter {
        return {
            toMySQL: () => `ALTER TABLE \`${this.table}\` MODIFY COLUMN \`${column}\` `
                + MicroColumnTypeObject.toSQLQuery('mysql', type, 'alter-column') + ';',
            toMSSQL: () => `ALTER TABLE [${this.table}] ALTER COLUMN [${column}] `
                + MicroColumnTypeObject.toSQLQuery('mssql', type, 'alter-column') + ';',
            toSQLite: async (ctx) => {
                if (!ctx?.runAdditionalSQL) throw "No runAdditionalSQL in context"; 

                const tableCreateOld = (await ctx.runAdditionalSQL(`
                    SELECT sql FROM sqlite_master WHERE type = "table" AND name = "${this.table}";
                `))?.[0]?.sql as string;
                if (!tableCreateOld) throw `Table ${this.table} not exists`;

                const indexesToRecreate = (await ctx.runAdditionalSQL(`
                    SELECT sql FROM sqlite_master WHERE type = "index"
                    AND tbl_name = "${this.table}" AND sql IS NOT NULL;
                `) as any[]).map(s => s.sql || s).filter(Boolean).join("; ") + ';';

                const tableCreateArray = tableCreateOld.split('\n');
                let _wasChanges = false;
                const tableColumnNames = [] as string[];
                for (let i = 0; i < tableCreateArray.length; i++) {
                    if (tableCreateArray[i].trim()[0] == '"') {
                        const str = tableCreateArray[i].trim().substring(1);
                        tableColumnNames.push(str.substring(0, str.indexOf('"')));
                    }
                    if (!tableCreateArray[i].includes('"' + column + '"')) continue;
                    const arr = tableCreateArray[i].split('\t');
                    const indexName = arr.findIndex((a) => a == '"' + column + '"');
                    if (indexName < 0) continue;
                    
                    arr[indexName + 1] = (() => {
                        let str = MicroColumnTypeObject.toSQLQuery('sqlite', type);
                        if (str.startsWith('text(')) str = str.replace("text(", "varchar(");
                        if (arr[indexName + 1].toLowerCase().includes(' unique')) str += ' UNIQUE';
                        if (arr[indexName + 1].endsWith(',')) str += ',';
                        return str;
                    })();
                    // console.log("CHANGES ARR:", arr);
                    tableCreateArray[i] = arr.join('\t');
                    _wasChanges = true;
                }
                if (!_wasChanges) return "SELECT 1";

                const RECHANGE_TABLE_NAME = this.table + "___rechange_" + utils.randomInclude(99);
                tableCreateArray[0] = `CREATE TABLE "${RECHANGE_TABLE_NAME}" (`;

                // console.log("Table create:", tableCreateNew);
                // console.log("INDEXES:", indexesToRecreate);
                // console.log("Colums:", tableColumnNames);
                
                // const hasColumnIndex = tableColumns.findIndex(
                //     (row) => row.name === column
                // );
                // if (hasColumnIndex < 0) return "SELECT 1";
                // // ctx?.runAdditionalSQL
                // // throw "Not implemented yet: changeColumnType for sqlite"
                return `
                    BEGIN;
                    ${tableCreateArray.join('\n')};
                    INSERT INTO ${RECHANGE_TABLE_NAME} (${tableColumnNames.join(', ')}) 
                        SELECT ${tableColumnNames.join(', ')} FROM ${this.table};
                    DROP TABLE ${this.table};
                    ALTER TABLE ${RECHANGE_TABLE_NAME} RENAME TO ${this.table};
                    ${indexesToRecreate}
                    COMMIT;
                `;
            },
        }
    }
}