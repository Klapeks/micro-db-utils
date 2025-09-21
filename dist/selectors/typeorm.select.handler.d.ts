import { DataSource, EntitySchema, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { AbstractSelectHandler, SelectEntityHandlerOptions } from './abstract.select.handler';
import { SelectOptions } from '@klapeks/api-creation-tools';
export declare type TypeormSelectEntityHandlerOptions<T extends ObjectLiteral, K extends string> = SelectEntityHandlerOptions<T, K> & {
    schema: EntitySchema<T>;
    dataSource: DataSource;
    beforeGetMany?: (builder: SelectQueryBuilder<T>, options: SelectOptions<T>) => Promise<void> | void;
};
export declare class SelectEntityHandler<T extends ObjectLiteral, K extends string> extends AbstractSelectHandler<T, K, TypeormSelectEntityHandlerOptions<T, K>> {
    constructor(options: TypeormSelectEntityHandlerOptions<T, K>);
    get dataSource(): DataSource;
    get schema(): EntitySchema<T>;
    get repo(): import("typeorm").Repository<T>;
    getTableName(): string;
    runSQL(sql: string, params?: any[]): Promise<any[]>;
    getTotal(): Promise<number>;
    rawSelect(options: SelectOptions<T>): Promise<{
        objects: T[];
        total: number;
    }>;
}
