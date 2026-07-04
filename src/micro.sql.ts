import { SQLAlterCommand } from "./sql";
import { SQLSelectCommands } from "./sql/commands/select.commands";
import { SQLTablesCommands } from "./sql/commands/tables.commands";

export namespace MicroSQL {

    export function alter(table: string) {
        return new SQLAlterCommand(table);
    }

    export function select(table: string) {
        return new SQLSelectCommands(table);
    }

    export function tables() {
        return SQLTablesCommands;
    }
}