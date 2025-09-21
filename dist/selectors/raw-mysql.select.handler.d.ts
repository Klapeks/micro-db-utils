import { SelectOptions } from "@klapeks/api-creation-tools";
import { RawMySQLConnection } from "../connections";
import { AbstractSelectHandler, SelectEntityHandlerOptions } from "./abstract.select.handler";
export type MySQLSelectEntityHandlerOptions<T extends object, K extends string> = SelectEntityHandlerOptions<T, K> & {
    schemaTableName: string;
    mysql: RawMySQLConnection;
};
export declare class MySQLSelectEntityHandler<T extends object, K extends string> extends AbstractSelectHandler<T, K, MySQLSelectEntityHandlerOptions<T, K>> {
    constructor(options: MySQLSelectEntityHandlerOptions<T, K>);
    getTableName(): string;
    runSQL(sql: string, params?: any[]): Promise<any[]>;
    getTotal(): Promise<number>;
    rawSelect(options: SelectOptions<T>): Promise<{
        objects: T[];
        total: number;
    }>;
}
