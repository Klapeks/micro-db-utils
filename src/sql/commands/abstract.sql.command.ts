
export interface SQLCommandData {
    query: string,
    params?: any[];
}

export interface ISQLCommandAdapter {
    toMySQL(): SQLCommandData | string;
    toMSSQL(): SQLCommandData | string;
}
export abstract class AbstractSQLCommand implements ISQLCommandAdapter {
    abstract toMySQL(): SQLCommandData | string;
    abstract toMSSQL(): SQLCommandData | string;
}