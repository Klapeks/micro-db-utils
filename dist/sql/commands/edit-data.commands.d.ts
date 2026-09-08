import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLEditDataCommands {
    private readonly table;
    constructor(table: string);
    insert(data: any): ISQLCommandAdapter;
    update(data: any, where: any): ISQLCommandAdapter;
    upsert(data: any, idKeys: string[]): ISQLCommandAdapter;
}
