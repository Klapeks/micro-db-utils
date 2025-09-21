import { SelectOptions, SelectResult, TimedStatisticInfo } from '@klapeks/api-creation-tools';
export interface SelectEntityHandlerOptions<T extends object, K extends string> {
    name: K;
    orderBy?: keyof T | (keyof T)[];
    /** @default "ASC" */
    orderType?: "ASC" | "DESC" | ("ASC" | "DESC")[];
    /** @default 100 */
    maxLimit?: number;
    afterSelect?: (objects: T[], options: SelectOptions<T>) => Promise<T[]>;
}
export declare abstract class AbstractSelectHandler<T extends object, K extends string, O extends SelectEntityHandlerOptions<T, K>> {
    readonly options: O;
    constructor(options: O);
    abstract getTableName(): string;
    abstract runSQL(query: string, params?: any[]): Promise<any[]>;
    runSQL_One(query: string, params?: any[]): Promise<any>;
    abstract getTotal(): Promise<number>;
    abstract rawSelect(options: SelectOptions<T>): Promise<{
        objects: T[];
        total: number;
    }>;
    select(options: SelectOptions<T>): Promise<SelectResult<T, K>>;
    sqlCount(field: string): Promise<number>;
    getSumStatistic(sumField: keyof T, strWhere?: string): Promise<TimedStatisticInfo>;
    handleQuery(req: any): Promise<SelectOptions<T>>;
}
