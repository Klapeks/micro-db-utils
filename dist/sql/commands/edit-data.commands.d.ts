import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLEditDataCommands {
    private readonly table;
    constructor(table: string);
    update(data: any, where: any): ISQLCommandAdapter;
    upsert(data: any, idKeys: string[]): ISQLCommandAdapter;
}
