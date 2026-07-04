import { DatabaseOptions } from "@klapeks/utils";
import { ISQLCommandAdapter, SQLAlterCommand, SQLCommandData, SQLEditDataCommands, SQLSelectCommands, SQLTablesCommands, SQLTimeCommandsExpressions, toRawSQL } from "./sql";
import { DataSource, DataSourceOptions } from "typeorm";

export namespace MicroSQL {

    export async function dataSourceQuery<T = any>(
        dataSource: DataSource, 
        cb: ISQLCommandAdapter | SQLCommandData | string | ((
            dbtype: DatabaseOptions['type'],
            database: string
        ) => ISQLCommandAdapter | SQLCommandData | string 
            | Promise<ISQLCommandAdapter | SQLCommandData | string>)
    ): Promise<T[]> {
        const dbType = dataSource.options.type as any as DatabaseOptions['type'];
        let query: string | ISQLCommandAdapter | SQLCommandData = (
            typeof cb == 'function' ? await cb(
                dbType, dataSource.options.database as any
            ) : cb
        );
        query = toRawSQL(dbType, query);
        return dataSource.query(query.query, query.params);
    }

    export function alter(table: string) {
        return new SQLAlterCommand(table);
    }

    export function select(table: string) {
        return new SQLSelectCommands(table);
    }
    export function editData(table: string) {
        return new SQLEditDataCommands(table);
    }

    export function tables() {
        return SQLTablesCommands;
    }

    export function timeExpressions(dbtype: DatabaseOptions['type'] | DataSourceOptions['type']) {
        return new SQLTimeCommandsExpressions(dbtype as any);
    }
}