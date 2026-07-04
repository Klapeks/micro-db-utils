import { DatabaseOptions } from "@klapeks/utils";


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
        return `time(${expr})`;
    }

}