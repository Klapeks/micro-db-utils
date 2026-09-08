import { DatabaseOptions } from "@klapeks/utils";
export interface SQLCommandData {
    query: string;
    params?: any[];
}
export interface SQLCommandContext {
    database: string;
    runAdditionalSQL: (sql: string, params?: any[]) => any;
}
export interface ISQLCommandAdapter {
    toMySQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    toSQLite(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
}
export declare abstract class AbstractSQLCommand implements ISQLCommandAdapter {
    abstract toMySQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    abstract toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    abstract toSQLite(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
}
export declare const rawSQL: (sqls: {
    defaultQuery: string;
    mysqlQuery?: string;
    mssqlQuery?: string;
    sqliteQuery?: string;
}) => ISQLCommandAdapter;
export declare function toRawSQL(dbType: DatabaseOptions['type'], query: ISQLCommandAdapter | SQLCommandData | string, ctx?: SQLCommandContext): Promise<SQLCommandData>;
