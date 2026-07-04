import { SQLAlterCommand } from "./sql";
import { SQLSelectCommands } from "./sql/commands/select.commands";
import { SQLTablesCommands } from "./sql/commands/tables.commands";
export declare namespace MicroSQL {
    function alter(table: string): SQLAlterCommand;
    function select(table: string): SQLSelectCommands;
    function tables(): typeof SQLTablesCommands;
}
