import { AbstractSQLCommand, ISQLCommandAdapter, SQLCommandData } from "../commands";



export abstract class AbstractSQLConnection {

    protected constructor(
        readonly abstractCommandFunctionName: keyof ISQLCommandAdapter
    ) {

    }

    abstract initConnection(): Promise<void>;
    protected abstract sendSQL<T = any>(query: string, params?: any[]): Promise<T[]>;

    // !! PARAMS WARNING: mysql use array of params, but mssql use key-value (object) params
    async runSQL<T = any>(query: SQLCommandData): Promise<T[]>;
    async runSQL<T = any>(query: ISQLCommandAdapter): Promise<T[]>;
    async runSQL<T = any>(query: AbstractSQLCommand): Promise<T[]>;
    async runSQL<T = any>(query: string, params?: any): Promise<T[]>;
    async runSQL<T = any>(
        query: string | ISQLCommandAdapter 
        | AbstractSQLCommand | SQLCommandData, 
        params?: any[]
    ): Promise<T[]> {
        if (!query) throw "Invalid arg";
        if (typeof query === 'string') {
            return this.sendSQL(query, params);
        }
        if (typeof query !== 'object') throw "Invalid arg";

        const abstrKey = this.abstractCommandFunctionName;
        if (abstrKey in query) query = await (query as any)?.[abstrKey]?.();
        if (!query) throw "Invalid arg";
        if (typeof query !== 'object') throw "Invalid arg";

        if ('query' in query) {
            return this.sendSQL(query.query, query.params || params);
        }
        throw "Invalid arg";
    }

    // !! PARAMS WARNING: mysql use array of params, but mssql use key-value (object) params
    async runSQL_One<T = any>(query: SQLCommandData): Promise<T | null>;
    async runSQL_One<T = any>(query: ISQLCommandAdapter): Promise<T | null>;
    async runSQL_One<T = any>(query: AbstractSQLCommand): Promise<T | null>;
    async runSQL_One<T = any>(query: string, params?: any): Promise<T | null>;
    async runSQL_One<T = any>(query: any, params?: any): Promise<T | null> {
        const res = await this.runSQL(query, params);
        return res.length ? (res[0] || res) : null;
    }
}