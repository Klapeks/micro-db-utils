import { DatabaseOptions } from "@klapeks/utils";
export declare class SQLTimeCommandsExpressions {
    readonly dbtype: DatabaseOptions['type'];
    constructor(dbtype: DatabaseOptions['type']);
    time(expr: string): string;
    date(expr: string): string;
}
