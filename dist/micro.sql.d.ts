import { DatabaseOptions } from "@klapeks/utils";
import { ISQLCommandAdapter, SQLAlterCommand, SQLCommandData, SQLSelectCommands, SQLTablesCommands, SQLTimeCommandsExpressions } from "./sql";
import { DataSource, DataSourceOptions } from "typeorm";
export declare namespace MicroSQL {
    function dataSourceQuery<T = any>(dataSource: DataSource, cb: ISQLCommandAdapter | SQLCommandData | string | ((dbtype: DatabaseOptions['type'], database: string) => ISQLCommandAdapter | SQLCommandData | string | Promise<ISQLCommandAdapter | SQLCommandData | string>)): Promise<T[]>;
    function alter(table: string): SQLAlterCommand;
    function select(table: string): SQLSelectCommands;
    function tables(): typeof SQLTablesCommands;
    function timeExpressions(dbtype: DatabaseOptions['type'] | DataSourceOptions['type']): SQLTimeCommandsExpressions;
}
