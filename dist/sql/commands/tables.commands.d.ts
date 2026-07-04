import { ISQLCommandAdapter } from "./abstract.sql.command";
import { MicroColumnTypeObject } from "../column.type.parser";
export declare class SQLTablesCommands {
    static tableInfo(database: string, table: string): ISQLCommandAdapter;
    static createTable(options: {
        table: string;
        columns: Record<string, MicroColumnTypeObject>;
    }): ISQLCommandAdapter;
}
