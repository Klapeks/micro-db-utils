import { MicroColumnTypeObject } from "../column.type.parser";
import { ISQLCommandAdapter } from "./abstract.sql.command";
export declare class SQLAlterCommand {
    private readonly table;
    constructor(table: string);
    renameColumn(old_name: string, new_name: string): ISQLCommandAdapter;
    changeColumnType(column: string, type: MicroColumnTypeObject): ISQLCommandAdapter;
    addColumn(column: string, type: MicroColumnTypeObject): ISQLCommandAdapter;
}
