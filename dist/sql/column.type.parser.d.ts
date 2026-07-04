import { DatabaseOptions } from "@klapeks/utils";
import { ColumnType } from "typeorm";
export declare function getRawDatabaseColumnTypeOfTypeORM(dbtype: DatabaseOptions['type'], type: ColumnType): ColumnType;
export interface MicroColumnTypeObject {
    type: ColumnType;
    primary?: boolean;
    length?: number;
    nullable?: boolean;
    default?: any;
}
export declare namespace MicroColumnTypeObject {
    function toSQLQuery(dbType: DatabaseOptions['type'], options: MicroColumnTypeObject, queryType?: "create-table" | "alter-column"): string;
}
