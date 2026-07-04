import { AbstractSQLCommand, ISQLCommandAdapter, SQLCommandContext, SQLCommandData } from "../commands";



export abstract class AbstractSQLConnection {

    protected constructor(
        readonly abstractCommandFunctionName: keyof ISQLCommandAdapter,
        readonly databaseName: string
    ) {

    }

    abstract initConnection(): Promise<void>;
    abstract destroyConnection(): Promise<void>;
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
        if (abstrKey in query) {
            query = await (query as any)?.[abstrKey]?.({
                database: this.databaseName
            } satisfies SQLCommandContext);
        }
        if (!query) throw "Invalid arg";
        if (typeof query === 'object') {
            if (!('query' in query)) throw "Invalid arg";
            params = query.params || params;
            query = query.query;
        }
        if (typeof query !== 'string') throw "Invalid arg";
        
        return this.sendSQL(query, params);
    }

    // !! PARAMS WARNING: mysql use array of params, but mssql use key-value (object) params
    async runSQL_One<T = any>(query: SQLCommandData): Promise<T | null>;
    async runSQL_One<T = any>(query: ISQLCommandAdapter): Promise<T | null>;
    async runSQL_One<T = any>(query: AbstractSQLCommand): Promise<T | null>;
    async runSQL_One<T = any>(query: string, params?: any): Promise<T | null>;
    async runSQL_One<T = any>(query: any, params?: any): Promise<T | null> {
        const res = await this.runSQL(query, params);
        if (res && Array.isArray(res)) {
            return res[0] || null;
        }
        return res || null;
    }
}