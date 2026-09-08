import { DatabaseOptions, getRawDatabaseColumnTypeOfTypeORM } from "@klapeks/utils";
import { ColumnType } from "typeorm";
export { getRawDatabaseColumnTypeOfTypeORM };
export interface MicroColumnTypeObject {
    type: ColumnType;
    primary?: boolean;
    length?: number;
    nullable?: boolean;
    default?: any;
    generated?: true | "increment";
}
export declare namespace MicroColumnTypeObject {
    function toSQLQuery(dbType: DatabaseOptions['type'], options: MicroColumnTypeObject, queryType?: "create-table" | "alter-column"): string;
}
