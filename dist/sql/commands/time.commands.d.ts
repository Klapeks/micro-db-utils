import { DatabaseOptions } from "@klapeks/utils";
export declare class SQLTimeCommandsExpressions {
    private readonly dbtype;
    constructor(dbtype: DatabaseOptions['type']);
    time(expr: string): string;
    date(expr: string): string;
    dateFromToWhere(dateAlias: string, from: Date, to?: Date): string;
}
