import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLEditDataCommands {
    private readonly table;
    constructor(table: string);
    upsert(data: any, idKeys: string[]): ISQLCommandAdapter;
}
