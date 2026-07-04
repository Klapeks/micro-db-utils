import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLSelectCommands {
    private readonly table;
    constructor(table: string);
    all(): ISQLCommandAdapter;
}
