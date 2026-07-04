export interface SQLCommandData {
    query: string;
    params?: any[];
}
export interface SQLCommandContext {
}
export interface ISQLCommandAdapter {
    toMySQL(ctx?: SQLCommandContext): SQLCommandData | string;
    toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string;
}
export declare abstract class AbstractSQLCommand implements ISQLCommandAdapter {
    abstract toMySQL(ctx?: SQLCommandContext): SQLCommandData | string;
    abstract toMSSQL(ctx?: SQLCommandContext): SQLCommandData | string;
}
export declare const rawSQL: (sqls: {
    defaultQuery: string;
    mysqlQuery?: string;
    mssqlQuery?: string;
}) => ISQLCommandAdapter;
