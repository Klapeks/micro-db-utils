import { MicroColumnTypeObject } from "../column.type.parser";
import { ISQLCommandAdapter } from "./abstract.sql.command";

export class SQLSelectCommands {
    
    constructor(readonly table: string) {}

    all(): ISQLCommandAdapter {
        return {
            toMySQL: () => `SELECT * FROM \`${this.table}\`;`,
            toMSSQL: () => `SELECT * FROM [${this.table}];`,
        }
    }
}