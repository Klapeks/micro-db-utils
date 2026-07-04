import { DatabaseOptions } from "@klapeks/utils";
import { SQLAlterCommand, SQLSelectCommands, SQLTablesCommands, SQLTimeCommandsExpressions } from "./sql";
import { DataSourceOptions } from "typeorm";

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

    export function timeExpressions(dbtype: DatabaseOptions['type'] | DataSourceOptions['type']) {
        return new SQLTimeCommandsExpressions(dbtype as any);
    }
}