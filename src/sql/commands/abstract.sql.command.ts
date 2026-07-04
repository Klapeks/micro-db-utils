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

export function toRawSQL(
    dbType: DatabaseOptions['type'],
    query: ISQLCommandAdapter | SQLCommandData | string
): SQLCommandData {
    if (typeof query === 'string') return { query };
    if (typeof query === 'object' && !('query' in query)) {
        if (dbType === 'mysql') query = query.toMySQL({});
        else if (dbType === 'mssql') query = query.toMSSQL({});
        else throw "Unknown database type: " + dbType;
    }
    return typeof query === 'string' ? { query } : query;
}