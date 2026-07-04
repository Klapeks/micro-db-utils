import { DatabaseOptions } from "@klapeks/utils";
import { toISODate } from "../../utils/iso.date.time";


export class SQLTimeCommandsExpressions {

    constructor(
        private readonly dbtype: DatabaseOptions['type']
    ) {}


    time(expr: string) {
        if (this.dbtype === 'mssql' 
        || this.dbtype == 'postgres') {
            return `CAST(${expr} AS TIME(0))`;
        }
        return `time(${expr})`;
    }
    date(expr: string) {
        if (this.dbtype === 'mssql' 
        || this.dbtype == 'postgres') {
            return `CAST(${expr} AS DATE)`;
        }
        return `date(${expr})`;
    }

    dateFromToWhere(dateAlias: string, from: Date, to?: Date) {
        let sql = this.date(dateAlias) + " >= " + "'" + toISODate(from, "yyyy-mm-dd") + "'";
        if (to) sql += ' AND ' + this.date(dateAlias) + " <= " + "'" + toISODate(to, "yyyy-mm-dd") + "'";
        return sql;
    }
}