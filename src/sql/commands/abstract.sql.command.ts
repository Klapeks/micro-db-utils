import { DatabaseOptions } from "@klapeks/utils";

export interface SQLCommandData {
    query: string,
    params?: any[];
}
export interface SQLCommandContext {
    // database: string
}

export interface ISQLCommandAdapter {
    toMySQL(ctx?: SQLCommandContext): SQLCommandData | string;
    toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string;
}
export abstract class AbstractSQLCommand implements ISQLCommandAdapter {
    abstract toMySQL(ctx?: SQLCommandContext): SQLCommandData | string;
    abstract toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string;
}

export const rawSQL = (sqls: {
    defaultQuery: string
    mysqlQuery?: string,
    mssqlQuery?: string,
}): ISQLCommandAdapter => {
    return {
        toMySQL: () => sqls.mysqlQuery || sqls.defaultQuery,
        toMSSQL: () => sqls.mssqlQuery || sqls.defaultQuery,
    }
}