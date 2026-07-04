import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLSelectCommands {
    readonly table: string;
    constructor(table: string);
    all(): ISQLCommandAdapter;
}
