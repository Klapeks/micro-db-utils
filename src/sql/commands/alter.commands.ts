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
            toSQLite: () => { throw "Not implemented yet: changeColumnType for sqlite :(" },
        }
    }
}