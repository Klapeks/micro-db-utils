import { AbstractSQLCommand, ISQLCommandAdapter, SQLCommandData } from "../commands";
export declare abstract class AbstractSQLConnection {
    readonly abstractCommandFunctionName: keyof ISQLCommandAdapter;
    readonly databaseName: string;
    protected constructor(abstractCommandFunctionName: keyof ISQLCommandAdapter, databaseName: string);
    abstract initConnection(): Promise<void>;
    abstract destroyConnection(): Promise<void>;
    protected abstract sendSQL<T = any>(query: string, params?: any[]): Promise<T[]>;
    runSQL<T = any>(query: SQLCommandData): Promise<T[]>;
    runSQL<T = any>(query: ISQLCommandAdapter): Promise<T[]>;
    runSQL<T = any>(query: AbstractSQLCommand): Promise<T[]>;
    runSQL<T = any>(query: string, params?: any): Promise<T[]>;
    runSQL_One<T = any>(query: SQLCommandData): Promise<T | null>;
    runSQL_One<T = any>(query: ISQLCommandAdapter): Promise<T | null>;
    runSQL_One<T = any>(query: AbstractSQLCommand): Promise<T | null>;
    runSQL_One<T = any>(query: string, params?: any): Promise<T | null>;
}
