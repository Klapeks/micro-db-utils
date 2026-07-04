import { DatabaseOptions } from "@klapeks/utils";
import { SQLAlterCommand, SQLSelectCommands, SQLTablesCommands, SQLTimeCommandsExpressions } from "./sql";
export declare namespace MicroSQL {
    function alter(table: string): SQLAlterCommand;
    function select(table: string): SQLSelectCommands;
    function tables(): typeof SQLTablesCommands;
    function timeExpressions(dbtype: DatabaseOptions['type']): SQLTimeCommandsExpressions;
}
