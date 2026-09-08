import { DatabaseOptions } from "@klapeks/utils";

export interface SQLCommandData {
    query: string,
    params?: any[];
}
export interface SQLCommandContext {
    database: string,
    runAdditionalSQL: (sql: string, params?: any[]) => any,
}

export interface ISQLCommandAdapter {
    toMySQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    toSQLite(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
}
export abstract class AbstractSQLCommand implements ISQLCommandAdapter {
    abstract toMySQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    abstract toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
    abstract toSQLite(ctx?: SQLCommandContext): SQLCommandData | string | Promise<string>;
}

export const rawSQL = (sqls: {
    defaultQuery: string
    mysqlQuery?: string,
    mssqlQuery?: string,
    sqliteQuery?: string,
}): ISQLCommandAdapter => {
    return {
        toMySQL: () => sqls.mysqlQuery || sqls.defaultQuery,
        toMSSQL: () => sqls.mssqlQuery || sqls.defaultQuery,
        toSQLite: () => sqls.sqliteQuery || sqls.defaultQuery,
    }
}

export async function toRawSQL(
    dbType: DatabaseOptions['type'],
    query: ISQLCommandAdapter | SQLCommandData | string,
    ctx?: SQLCommandContext
): Promise<SQLCommandData> {
    if (typeof query === 'string') return { query };
    if (typeof query === 'object' && !('query' in query)) {
        if (dbType === 'mysql') query = await query.toMySQL(ctx);
        else if (dbType === 'mssql') query = await query.toMSSQL(ctx);
        else if (dbType === 'sqlite') query = await query.toSQLite(ctx);
        else throw "Unknown database type: " + dbType;
    }
    return typeof query === 'string' ? { query } : query;
}