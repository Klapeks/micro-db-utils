import { ISQLCommandAdapter } from "./abstract.sql.command";

export class SQLAlterCommand {
    
    constructor(readonly table: string) {}

    renameColumn(old_name: string, new_name: string): ISQLCommandAdapter {
        return {
            toMySQL: () => `ALTER TABLE ${this.table} RENAME COLUMN \`${old_name}\` TO \`${new_name}\`;`,
            toMSSQL: () => `EXEC sp_rename '${this.table}.${old_name}', '${new_name}', 'COLUMN';`
        }
    }

    changeColumnType(column: string, type: string): ISQLCommandAdapter {
        return {
            toMySQL: () => `ALTER TABLE ${this.table} MODIFY \`${column}\` ${type};`,
            toMSSQL: () => `ALTER TABLE ${this.table} ALTER COLUMN ${column} ${type};`
        }
    }
}

export function alter(table: string) {
    return new SQLAlterCommand(table);
}