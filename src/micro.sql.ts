import { DatabaseOptions } from "@klapeks/utils";
import { SQLAlterCommand, SQLSelectCommands, SQLTablesCommands, SQLTimeCommandsExpressions } from "./sql";

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

    export function timeExpressions(dbtype: DatabaseOptions['type']) {
        return new SQLTimeCommandsExpressions(dbtype);
    }
}